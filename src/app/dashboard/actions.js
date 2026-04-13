// src/app/dashboard/actions.js
'use server'

import { createClient } from '../../utils/supabase/server'
import prisma from '../../utils/prisma'
import { revalidatePath } from 'next/cache'
import { BUILDINGS, EMPLOYEES, OFFICES_PER_HQ } from '../../game/constants'
import { sanitizeCompany, sanitizeNumber } from '../../utils/company'

// Mapeo para conectar los tipos de constantes con los campos de la DB
const buildingFieldMap = {
  HQ: 'hqCount',
  OFFICE: 'officeCount',
  DATACENTER: 'datacenterCount',
  BASEMENT: 'basementCount'
}

const buildingLevelMap = {
  OFFICE: 'officeLevel',
  DATACENTER: 'datacenterLevel',
  BASEMENT: 'basementLevel'
}

const roleFieldMap = {
  PROGRAMMER: 'programmers',
  ANALYST: 'analysts',
  SABOTEUR: 'saboteurs'
}

// ACCIÓN MAESTRA: COMPRAR EDIFICIOS (Ahora usa incrementos)
export async function buyFacility(type) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const buildingData = BUILDINGS[type]
    const countField = buildingFieldMap[type]
    const company = sanitizeCompany(await prisma.company.findUnique({
      where: { ownerId: user.id }
    }))

    if (!buildingData || !countField || !company) {
      return { error: "No se pudo cargar la empresa." }
    }

    if (company.liquidCash < buildingData.basePrice) {
      return { error: `Fondos insuficientes para ${buildingData.name}.` }
    }

    if (type === 'OFFICE') {
      const availableOfficeSlots = sanitizeNumber(company.hqCount, 0, { min: 0 }) * OFFICES_PER_HQ

      if (company.officeCount >= availableOfficeSlots) {
        return { error: "Necesitas comprar otro HQ para habilitar más oficinas." }
      }
    }

    // Ejecutamos la transacción: Restar dinero e incrementar contador
    // Prisma permite hacer esto de forma atómica con { increment: 1 }
    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        liquidCash: { decrement: buildingData.basePrice },
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

// ACCIÓN MAESTRA: CONTRATAR PERSONAL (Lógica de espacio simplificada)
export async function hireStaff(role) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = sanitizeCompany(await prisma.company.findUnique({
      where: { ownerId: user.id }
    }))

    const staffData = EMPLOYEES[role]
    const countField = roleFieldMap[role]
    if (!company || !staffData || !countField) {
      return { error: "No se pudo cargar la empresa." }
    }
    
    // 1. Validar Dinero
    if (company.liquidCash < staffData.costToHire) {
      return { error: `Fondos insuficientes para reclutar ${staffData.name}` }
    }

    // 2. Validar Espacio (Basado en contadores y niveles globales)
    const buildingType = staffData.requiredBuilding
    const buildingCount = company[buildingFieldMap[buildingType]]
    const buildingLevel = company[buildingLevelMap[buildingType]]
    
    // Obtenemos la capacidad específica del nivel actual de la empresa para ese edificio
    const capacityPerBuilding = sanitizeNumber(
      BUILDINGS[buildingType]?.levels?.[buildingLevel]?.capacity ??
      BUILDINGS[buildingType]?.levels?.[1]?.capacity,
      0,
      { min: 0 }
    )
    const totalCapacity = buildingCount * capacityPerBuilding

    if (company[countField] >= totalCapacity) {
      return { error: `Capacidad máxima alcanzada en ${BUILDINGS[buildingType].name}s.` }
    }

    // 3. Ejecutar Contratación Atómica
    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        [countField]: { increment: 1 },
        liquidCash: { decrement: staffData.costToHire }
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Error en el departamento de reclutamiento." }
  }
}

// ACTUALIZAR AJUSTES (Sin cambios, pero incluido para completar el archivo)
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
