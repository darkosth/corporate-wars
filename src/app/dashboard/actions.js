'use server'

import { createClient } from '../../utils/supabase/server'
import prisma from '../../utils/prisma'
import { revalidatePath } from 'next/cache'
import { calculateGameState } from '../../utils/gameEngine' 

// MAPAS DE BASE DE DATOS: La fuente de la verdad
const buildingFieldMap = {
  HQ: 'hqCount',
  OFFICE: 'officeCount',
  DATACENTER: 'datacenterCount',
  BASEMENT: 'basementCount'
}

const roleFieldMap = {
  PROGRAMMER: 'programmers',
  ANALYST: 'analysts',
  SABOTEUR: 'saboteurs'
}

const buildingLevelMap = {
  HQ: 'hqLevel',
  OFFICE: 'officeLevel',
  DATACENTER: 'datacenterLevel',
  BASEMENT: 'basementLevel'
}

// ACCIÓN MAESTRA: COMPRAR EDIFICIOS
export async function buyFacility(type) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
    if (!company) return { error: "No se pudo cargar la empresa." }

    const gameState = calculateGameState(company)
    const facilityData = gameState.infrastructure[type]
    const countField = buildingFieldMap[type]

    if (!facilityData || !countField) return { error: "Edificio no válido." }

    const price = facilityData[`${type}_CONF`].basePrice

    if (gameState.player.liquidCash < price) {
      return { error: `Fondos insuficientes para ${facilityData[`${type}_CONF`].name}.` }
    }

    if (type !== 'HQ' && gameState.infrastructure.slots.isFull) {
      return { error: "El HQ no tiene parcelas disponibles. Sube de nivel el HQ o compra uno nuevo." }
    }

    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        liquidCash: { decrement: price },
        [countField]: { increment: 1 }
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Error al procesar la compra." }
  }
}

// ACCIÓN MAESTRA: CONTRATAR PERSONAL
export async function hireStaff(role, quantity = 1) {
  try {
    const safeQty = Math.max(1, Math.trunc(Number(quantity)))

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
    if (!company) return { error: "No se pudo cargar la empresa." }

    const gameState = calculateGameState(company)
    const staffData = gameState.staff[role]
    const countField = roleFieldMap[role]

    if (!staffData || !countField) return { error: "Rol no válido." }
    
    const unitPrice = staffData[`${role}_CONF`].costToHire
    const totalCost = unitPrice * safeQty

    if (gameState.player.liquidCash < totalCost) {
      return { error: `Fondos insuficientes para reclutar ${safeQty}x ${staffData[`${role}_CONF`].name}.` }
    }

    const availableSpace = staffData[`${role}_SNAP`].capacityLimit - staffData.count
    if (safeQty > availableSpace) {
      return { error: `Solo tienes espacio físico para ${availableSpace} empleado(s) más.` }
    }

    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        [countField]: { increment: safeQty },
        liquidCash: { decrement: totalCost }
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Error en el departamento de reclutamiento." }
  }
}

// ACCIÓN MAESTRA: MEJORAR NIVEL DE INSTALACIÓN
export async function upgradeFacility(type) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
    if (!company) return { error: "No se pudo cargar la empresa." }

    const gameState = calculateGameState(company)
    const facilityData = gameState.infrastructure[type]
    const levelField = buildingLevelMap[type]

    if (!facilityData || !levelField) return { error: "Instalación no válida." }

    const conf = facilityData[`${type}_CONF`]

    if (conf.isMaxLevel) {
      return { error: "Esta instalación ya alcanzó su nivel máximo tecnológico." }
    }

    if (gameState.player.liquidCash < conf.nextUpgradeCost) {
      return { error: `Fondos insuficientes. Necesitas $${conf.nextUpgradeCost.toLocaleString()} para la mejora.` }
    }

    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        liquidCash: { decrement: conf.nextUpgradeCost },
        [levelField]: { increment: 1 } 
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Error al procesar la mejora de infraestructura." }
  }
}

// ACCIÓN MAESTRA: VENDER INSTALACIÓN (LIQUIDACIÓN)
export async function sellFacility(type) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
    if (!company) return { error: "No se pudo cargar la empresa." }

    const gameState = calculateGameState(company)
    const facilityData = gameState.infrastructure[type]
    const countField = buildingFieldMap[type] // 👈 USAMOS EL MAPA AQUÍ
    
    if (!facilityData || facilityData.count <= 0) return { error: "No tienes instalaciones de este tipo para vender." }

    // REGLA 1: No vender el último HQ
    if (type === 'HQ' && facilityData.count <= 1) {
      return { error: "No puedes vender tu Sede Central principal." }
    }

    // REGLA 2: Lógica de Cascada (Capacidad vs Ocupación)
    if (type === 'HQ') {
      const capacityPerHQ = facilityData[`HQ_CONF`].unitCapacity;
      const newTotalCapacity = gameState.infrastructure.slots.total - capacityPerHQ;
      if (gameState.infrastructure.slots.occupied > newTotalCapacity) {
        return { error: "Debes vender otros edificios primero. Las parcelas de este HQ están en uso." }
      }
    } else {
      const roleMap = { 'OFFICE': 'PROGRAMMER', 'DATACENTER': 'ANALYST', 'BASEMENT': 'SABOTEUR' };
      const role = roleMap[type];
      const staffData = gameState.staff[role];
      
      const capacityPerBuilding = facilityData[`${type}_CONF`].unitCapacity;
      const newTotalCapacity = facilityData[`${type}_SNAP`].totalCapacity - capacityPerBuilding;
      
      if (staffData && staffData.count > newTotalCapacity) {
        return { error: `Debes despedir personal primero. No habrá espacio físico para todos.` }
      }
    }

    const refund = Math.floor(facilityData[`${type}_CONF`].basePrice / 2);

    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        [countField]: { decrement: 1 },
        liquidCash: { increment: refund }
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Error procesando la liquidación." }
  }
}

// ACCIÓN MAESTRA: DESPEDIR PERSONAL (RECORTE DE NÓMINA)
export async function fireStaff(role, quantity = 1) {
  try {
    const safeQty = Math.max(1, Math.trunc(Number(quantity)))
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
    if (!company) return { error: "No se pudo cargar la empresa." }

    const gameState = calculateGameState(company)
    const staffData = gameState.staff[role]
    const countField = roleFieldMap[role] // 👈 USAMOS EL MAPA AQUÍ

    if (!staffData || staffData.count < safeQty || !countField) {
      return { error: "No tienes suficiente personal para despedir esa cantidad." }
    }

    const unitRefund = Math.floor(staffData[`${role}_CONF`].costToHire / 2);
    const totalRefund = unitRefund * safeQty;

    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        [countField]: { decrement: safeQty },
        liquidCash: { increment: totalRefund }
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Error en el departamento de Recursos Humanos." }
  }
}

// ACTUALIZAR AJUSTES
export async function updateSettings(formData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "No autorizado" }

    const companyName = formData.get('companyName')
    const ceoName = formData.get('ceoName')

    await prisma.company.update({
      where: { ownerId: user.id },
      data: { companyName, ceoName }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    return { error: "Error al actualizar los datos o el nombre ya existe." }
  }
}
