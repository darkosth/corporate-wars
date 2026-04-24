import prisma from './prisma'
import { BUILDINGS, EMPLOYEES } from '../game/constants' // <-- BUILDINGS_PER_HQ eliminado
import { sanitizeCompany, sanitizeNumber } from './company'

//🛠️ MOTOR INTERNO: Genera el informe de un edificio
function getBuildingSnapshot(type, count, level) {
  const buildingBase = BUILDINGS[type];
  const levelConf = buildingBase.levels[level] || buildingBase.levels[1];
  

  const nextLevelConf = buildingBase.levels[level + 1]; 

  return {
    type,
    level,
    count: sanitizeNumber(count, 0),
    // _CONF: Información estática de la constante
    [type + '_CONF']: {
      name: buildingBase.name,
      emoji: buildingBase.emoji,
      description: buildingBase.description,
      basePrice: buildingBase.basePrice,
      baseMaintenance: levelConf.maintenance,
      baseRevenue: levelConf.revenue,
      unitCapacity: levelConf.capacity,
      
      // LA MAGIA DE LOS UPGRADES
      nextUpgradeCost: nextLevelConf ? nextLevelConf.upgradeCost : null,
      isMaxLevel: !nextLevelConf 
    },
    // _SNAP: Estado dinámico calculado
    [type + '_SNAP']: {
      totalMaintenance: count * levelConf.maintenance,
      totalRevenue: count * levelConf.revenue,
      totalCapacity: count * levelConf.capacity
    }
  };
}

/**
 * 👥 MOTOR INTERNO: Genera el informe de un rol de empleado
 */
function getStaffSnapshot(role, count, buildingSnap) {
  const staffConf = EMPLOYEES[role];
  const safeCount = sanitizeNumber(count, 0);
  const capacityLimit = buildingSnap.totalCapacity;
  
  return {
    role,
    count: safeCount,
    [role + '_CONF']: {
      name: staffConf.name,
      emoji: staffConf.emoji,
      description: staffConf.description,
      costToHire: staffConf.costToHire,
      salary: staffConf.salaryPerHour,
      revenue: staffConf.revenuePerHour,
      requiredBuilding: staffConf.requiredBuilding
    },
    [role + '_SNAP']: {
      totalSalary: safeCount * staffConf.salaryPerHour,
      totalRevenue: safeCount * staffConf.revenuePerHour,
      capacityLimit: capacityLimit,
      isFull: safeCount >= capacityLimit
    }
  };
}

/**
 * 🧠 EL CEREBRO: Crea el Unified Game State
 */
export function calculateGameState(company) {
  const safeCompany = sanitizeCompany(company);
  if (!safeCompany) return null;

  const BASE_REVENUE = 1500;

  // 1. Generamos Snapshots de Infraestructura
  const hq = getBuildingSnapshot('HQ', safeCompany.hqCount, safeCompany.hqLevel);
  const office = getBuildingSnapshot('OFFICE', safeCompany.officeCount, safeCompany.officeLevel);
  const datacenter = getBuildingSnapshot('DATACENTER', safeCompany.datacenterCount, safeCompany.datacenterLevel);
  const basement = getBuildingSnapshot('BASEMENT', safeCompany.basementCount, safeCompany.basementLevel);

  // 2. Generamos Snapshots de Personal
  const programmers = getStaffSnapshot('PROGRAMMER', safeCompany.programmers, office.OFFICE_SNAP);
  const analysts = getStaffSnapshot('ANALYST', safeCompany.analysts, datacenter.DATACENTER_SNAP);
  const saboteurs = getStaffSnapshot('SABOTEUR', safeCompany.saboteurs, basement.BASEMENT_SNAP);

  // 3.Cálculo de Parcelas (Slots) basado en la capacidad del HQ
  const totalSlotsUnlocked = hq.HQ_SNAP.totalCapacity; 
  const totalBuildingsOccupied = office.count + datacenter.count + basement.count;

  // 4. Consolidación Financiera (Ingresos y Gastos totales)
  const totalRevenue = BASE_REVENUE + 
    hq.HQ_SNAP.totalRevenue + office.OFFICE_SNAP.totalRevenue + 
    datacenter.DATACENTER_SNAP.totalRevenue + basement.BASEMENT_SNAP.totalRevenue +
    programmers.PROGRAMMER_SNAP.totalRevenue + analysts.ANALYST_SNAP.totalRevenue + 
    saboteurs.SABOTEUR_SNAP.totalRevenue;

  const totalExpenses = 
    hq.HQ_SNAP.totalMaintenance + office.OFFICE_SNAP.totalMaintenance + 
    datacenter.DATACENTER_SNAP.totalMaintenance + basement.BASEMENT_SNAP.totalMaintenance +
    programmers.PROGRAMMER_SNAP.totalSalary + analysts.ANALYST_SNAP.totalSalary +
    saboteurs.SABOTEUR_SNAP.totalSalary;

  return {
    player: {
      name: safeCompany.ceoName,
      companyName: safeCompany.companyName,
      liquidCash: safeCompany.liquidCash
    },
    finances: {
      revenuePerHour: totalRevenue,
      expensesPerHour: totalExpenses,
      netFlowPerHour: totalRevenue - totalExpenses
    },
    infrastructure: {
      slots: {
        occupied: totalBuildingsOccupied,
        total: totalSlotsUnlocked,
        isFull: totalBuildingsOccupied >= totalSlotsUnlocked
      },
      HQ: hq,
      OFFICE: office,
      DATACENTER: datacenter,
      BASEMENT: basement
    },
    staff: {
      PROGRAMMER: programmers,
      ANALYST: analysts,
      SABOTEUR: saboteurs
    }
  };
}

  //⏳ SINCRONIZADOR

export async function syncCompanyEconomy(userId) {
  const company = await prisma.company.findUnique({ where: { ownerId: userId } });
  if (!company) return null;

  const now = new Date();
  const secondsPassed = (now.getTime() - new Date(company.lastUpdated).getTime()) / 1000;

  const gameState = calculateGameState(company);
  const cashGenerated = secondsPassed * (gameState.finances.netFlowPerHour / 3600);

  return await prisma.company.update({
    where: { ownerId: userId },
    data: {
      liquidCash: Math.max(0, company.liquidCash + cashGenerated),
      lastUpdated: now
    }
  });
}