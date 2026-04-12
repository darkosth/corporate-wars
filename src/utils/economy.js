// src/utils/economy.js
import prisma from './prisma'
// 1. EL CEREBRO MATEMÁTICO: Calcula la economía en tiempo real
import { BUILDINGS, EMPLOYEES } from '../game/constants'

export function calculateCompanyStats(company) {
  const BASE_REVENUE = 1500; 
  
  // 1. Ingresos y Gastos base de los empleados
  let totalRevenue = BASE_REVENUE + (company.programmers * EMPLOYEES.PROGRAMMER.revenuePerHour);
  let totalExpenses = company.programmers * EMPLOYEES.PROGRAMMER.salaryPerHour;

  // 2. Ingresos y Gastos de TODOS los edificios (Magia dinámica)
  const facilities = company.facilities || [];
  facilities.forEach(facility => {
    // Tomamos la constante del edificio basado en su tipo ("OFFICE", "DATACENTER", etc.)
    const buildingData = BUILDINGS[facility.type];
    
    if (buildingData) {
      // Sumamos el mantenimiento
      totalExpenses += buildingData.baseMaintenance * facility.level;
      // Sumamos el ingreso pasivo
      totalRevenue += buildingData.baseRevenue * facility.level; 
    }
  });

  return {
    revenuePerHour: totalRevenue,
    expensesPerHour: totalExpenses,
    netFlowPerHour: totalRevenue - totalExpenses
  };
}

// 2. EL MOTOR DE TIEMPO (Lazy Evaluation)
export async function syncCompanyEconomy(userId) {
  const company = await prisma.company.findUnique({
    where: { ownerId: userId },
    include: { facilities: true }
  })

  if (!company) return null

  // ¿Cuánto tiempo pasó?
  const now = new Date()
  const msPassed = now.getTime() - company.lastUpdated.getTime()
  const secondsPassed = msPassed / 1000

  // Usamos el cerebro matemático para saber los números reales
  const stats = calculateCompanyStats(company)
  const netFlowPerSecond = stats.netFlowPerHour / 3600
  const cashGenerated = secondsPassed * netFlowPerSecond

  const newLiquidCash = Math.max(0, company.liquidCash + cashGenerated)

  // Solo guardamos el nuevo dinero en la base de datos
  const updatedCompany = await prisma.company.update({
    where: { ownerId: userId },
    data: {
      liquidCash: newLiquidCash,
      lastUpdated: now
    },
    include: { facilities: true } // Devolvemos la compañía completa para el UI
  })

  return updatedCompany
}