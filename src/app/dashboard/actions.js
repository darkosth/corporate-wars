// src/app/dashboard/actions.js
'use server'

import { createClient } from '../../utils/supabase/server'
import prisma from '../../utils/prisma'
import { revalidatePath } from 'next/cache'
import { BUILDINGS, EMPLOYEES } from '../../game/constants'

export async function buyFacility(type) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
    const buildingData = BUILDINGS[type] // "OFFICE", "DATACENTER" o "BASEMENT"

    if (company.liquidCash < buildingData.basePrice) {
      return { error: `Fondos insuficientes para ${buildingData.name}` }
    }

    await prisma.$transaction([
      prisma.company.update({
        where: { ownerId: user.id },
        data: { liquidCash: company.liquidCash - buildingData.basePrice }
      }),
      prisma.facility.create({
        data: { companyId: company.id, type: type, level: 1 }
      })
    ])

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    return { error: "Error en la constructora." }
  }
}

// ACCIÓN MAESTRA: CONTRATAR PERSONAL
export async function hireStaff(role) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sesión expirada." }

    const company = await prisma.company.findUnique({
      where: { ownerId: user.id },
      include: { facilities: true }
    })

    const staffData = EMPLOYEES[role] // "PROGRAMMER", "ANALYST" o "SABOTEUR"
    
    // 1. Validar Dinero
    if (company.liquidCash < staffData.costToHire) {
      return { error: `No puedes pagar el reclutamiento de ${staffData.name}` }
    }

    // 2. Validar Espacio (Dinámico según el tipo de edificio requerido)
    const requiredType = staffData.requiredBuilding
    const relevantFacilities = company.facilities.filter(f => f.type === requiredType)
    const totalCapacity = relevantFacilities.reduce((total, f) => {
      return total + (f.level * BUILDINGS[requiredType].capacityPerLevel)
    }, 0)

    // Mapeo de campos en la DB
    const roleFieldMap = {
      PROGRAMMER: 'programmers',
      ANALYST: 'analysts',
      SABOTEUR: 'saboteurs'
    }

    if (company[roleFieldMap[role]] >= totalCapacity) {
      return { error: `No hay espacio en los ${BUILDINGS[requiredType].name}s.` }
    }

    // 3. Ejecutar Contratación
    await prisma.company.update({
      where: { ownerId: user.id },
      data: {
        [roleFieldMap[role]]: company[roleFieldMap[role]] + 1,
        liquidCash: company.liquidCash - staffData.costToHire
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    return { error: "Error en recursos humanos." }
  }
}

export async function updateSettings(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const companyName = formData.get('companyName')
  const ceoName = formData.get('ceoName')

  try {
    await prisma.company.update({
      where: { ownerId: user.id },
      data: { companyName, ceoName }
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    return { error: "Ese nombre de empresa ya existe." }
  }
}