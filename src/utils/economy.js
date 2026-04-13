// src/utils/economy.js
import prisma from './prisma'
import { BUILDINGS, EMPLOYEES } from '../game/constants'
import { sanitizeCompany, sanitizeNumber } from './company'

function getBuildingLevelData(type, level) {
  return BUILDINGS[type]?.levels?.[level] || BUILDINGS[type]?.levels?.[1]
}

export function calculateCompanyStats(company) {
  const safeCompany = sanitizeCompany(company)

  if (!safeCompany) {
    return {
      revenuePerHour: 0,
      expensesPerHour: 0,
      netFlowPerHour: 0
    }
  }

  const BASE_REVENUE = 1500;

  // Extraemos datos clave de la compañía para los cálculos
  const programmers = safeCompany.programmers;
  const analysts = safeCompany.analysts;
  const saboteurs = safeCompany.saboteurs;
  const hqCount = safeCompany.hqCount;
  const officeCount = safeCompany.officeCount;
  const datacenterCount = safeCompany.datacenterCount;
  const basementCount = safeCompany.basementCount;

  //calculamos ingresos de empleados
  const programmersRevenue = programmers * EMPLOYEES.PROGRAMMER.revenuePerHour;
  const analystsRevenue = analysts * EMPLOYEES.ANALYST.revenuePerHour;
  const saboteursRevenue = saboteurs * EMPLOYEES.SABOTEUR.revenuePerHour;
  const totalEmployeeRevenue = programmersRevenue + analystsRevenue + saboteursRevenue;

  //calculamos gastos de empleados
  const programmersExpenses = programmers * EMPLOYEES.PROGRAMMER.salaryPerHour;
  const analystsExpenses = analysts * EMPLOYEES.ANALYST.salaryPerHour;
  const saboteursExpenses = saboteurs * EMPLOYEES.SABOTEUR.salaryPerHour;
  const totalEmployeeExpenses = programmersExpenses + analystsExpenses + saboteursExpenses;



  // 1. Ingresos y Gastos base de los empleados
  let totalRevenue = BASE_REVENUE + totalEmployeeRevenue;
  let totalExpenses = totalEmployeeExpenses;

  const hqLevelData = getBuildingLevelData('HQ', safeCompany.hqLevel);
  const officeLevelData = getBuildingLevelData('OFFICE', safeCompany.officeLevel);
  const datacenterLevelData = getBuildingLevelData('DATACENTER', safeCompany.datacenterLevel);
  const basementLevelData = getBuildingLevelData('BASEMENT', safeCompany.basementLevel);

  totalExpenses += hqCount * sanitizeNumber(hqLevelData?.maintenance, 0, { min: 0 });
  totalRevenue += hqCount * sanitizeNumber(hqLevelData?.revenue, 0, { min: 0 });

  totalExpenses += officeCount * sanitizeNumber(officeLevelData?.maintenance, 0, { min: 0 });
  totalRevenue += officeCount * sanitizeNumber(officeLevelData?.revenue, 0, { min: 0 });

  totalExpenses += datacenterCount * sanitizeNumber(datacenterLevelData?.maintenance, 0, { min: 0 });
  totalRevenue += datacenterCount * sanitizeNumber(datacenterLevelData?.revenue, 0, { min: 0 });

  totalExpenses += basementCount * sanitizeNumber(basementLevelData?.maintenance, 0, { min: 0 });
  totalRevenue += basementCount * sanitizeNumber(basementLevelData?.revenue, 0, { min: 0 });

  return {
    revenuePerHour: sanitizeNumber(totalRevenue, 0),
    expensesPerHour: sanitizeNumber(totalExpenses, 0),
    netFlowPerHour: sanitizeNumber(totalRevenue - totalExpenses, 0)
  };
}

// 2. EL MOTOR DE TIEMPO (Lazy Evaluation)
export async function syncCompanyEconomy(userId) {
  const company = await prisma.company.findUnique({
    where: { ownerId: userId }
  })

  if (!company) return null

  const safeCompany = sanitizeCompany(company)

  // ¿Cuánto tiempo pasó?
  const now = new Date()
  const msPassed = now.getTime() - safeCompany.lastUpdated.getTime()
  const secondsPassed = msPassed / 1000

  // Usamos el cerebro matemático para saber los números reales
  const stats = calculateCompanyStats(safeCompany)
  const netFlowPerSecond = stats.netFlowPerHour / 3600
  const cashGenerated = secondsPassed * netFlowPerSecond

  const newLiquidCash = Math.max(0, safeCompany.liquidCash + cashGenerated)

  // Solo guardamos el nuevo dinero en la base de datos
  const updatedCompany = await prisma.company.update({
    where: { ownerId: userId },
    data: {
      liquidCash: newLiquidCash,
      lastUpdated: now
    }
  })

  return updatedCompany
}
