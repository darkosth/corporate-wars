'use client'

import { useState } from 'react'
import { buyFacility, fireStaff, hireStaff, sellFacility, upgradeFacility } from '../app/dashboard/actions'
import ActionCard from './ui/ActionCard'
import DashboardSectionHeader from './ui/DashboardSectionHeader'
import FacilityHero from './ui/FacilityHero'
import ModuleSection from './ui/ModuleSection'
import StaffActionCard from './ui/StaffActionCard'

const tabConfig = {
  hq: {
    title: 'Headquarters',
    description: 'Gestión de terrenos, zonificación y construcción de infraestructura.',
    buildingKey: 'HQ',
    staffKey: null
  },
  office: {
    title: 'Operaciones',
    description: 'Centro de desarrollo de software de alta frecuencia.',
    buildingKey: 'OFFICE',
    staffKey: 'PROGRAMMER'
  },
  datacenter: {
    title: 'Centro de Investigación',
    description: 'Procesamiento de datos y analítica avanzada.',
    buildingKey: 'DATACENTER',
    staffKey: 'ANALYST'
  },
  basement: {
    title: 'Operaciones Encubiertas',
    description: 'Instalaciones no registradas. Máxima seguridad.',
    buildingKey: 'BASEMENT',
    staffKey: 'SABOTEUR'
  }
}

export default function DashboardControls({ currentTab, player, infrastructure, staff }) {
  const [error, setError] = useState(null)
  const [loadingState, setLoadingState] = useState(false)

  const executeAction = async (actionPromise) => {
    setLoadingState(true)
    const result = await actionPromise
    if (result?.error) setError(result.error)
    else setError(null)
    setLoadingState(false)
  }

  const currentTabConfig = tabConfig[currentTab]
  const buildingData = currentTabConfig ? infrastructure[currentTabConfig.buildingKey] : null
  const staffData = currentTabConfig?.staffKey ? staff[currentTabConfig.staffKey] : null

  const checkAfford = (price) => player.liquidCash >= price
  const slots = infrastructure.slots
  const buildingTypes = ['HQ', 'OFFICE', 'DATACENTER', 'BASEMENT']

  const isHQ = buildingData?.type === 'HQ'
  const buildingSnapshot = buildingData ? buildingData[`${buildingData.type}_SNAP`] : null
  const staffSnapshot = staffData ? staffData[`${staffData.role}_SNAP`] : null
  const buildingConf = buildingData ? buildingData[`${buildingData.type}_CONF`] : null
  const staffConf = staffData ? staffData[`${staffData.role}_CONF`] : null

  const capacityLabel = isHQ ? 'Capacidad de Parcelas' : 'Ocupación de Personal'
  const capacityValue = isHQ
    ? `${buildingSnapshot?.totalCapacity || 0} edificios`
    : `${staffData?.count || 0} / ${buildingSnapshot?.totalCapacity || 0} empleados`

  const departmentMetrics = {
    gross: (buildingSnapshot?.totalRevenue || 0) + (staffSnapshot?.totalRevenue || 0),
    expenses: (buildingSnapshot?.totalMaintenance || 0) + (staffSnapshot?.totalSalary || 0),
    facilityExpense: buildingSnapshot?.totalMaintenance || 0,
    staffExpense: staffSnapshot?.totalSalary || 0,
    staffRevenue: staffSnapshot?.totalRevenue || 0,
    net: 0,
    isNetPositive: false
  }

  departmentMetrics.net = departmentMetrics.gross - departmentMetrics.expenses
  departmentMetrics.isNetPositive = departmentMetrics.net >= 0

  const upgradeCost = buildingConf?.nextUpgradeCost || 0
  const canUpgrade = buildingConf?.isMaxLevel ? false : checkAfford(upgradeCost)

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in pb-20 duration-500">
      <DashboardSectionHeader
        title={currentTabConfig?.title || ''}
        description={currentTabConfig?.description || ''}
        level={buildingData?.level}
        slots={slots}
      />

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-400">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-10">
        <FacilityHero
          buildingData={buildingData}
          staffData={staffData}
          departmentMetrics={departmentMetrics}
          capacityLabel={capacityLabel}
          capacityValue={capacityValue}
          isLoading={loadingState}
          canUpgrade={canUpgrade}
          upgradeCost={upgradeCost}
          onUpgrade={() => executeAction(upgradeFacility(buildingData.type))}
        />

        {isHQ ? (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
              <span>🏗️</span> Planificación Urbana Corporativa
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {buildingTypes.map((type) => {
                const facilityData = infrastructure[type]
                const facilityConf = facilityData[`${type}_CONF`]
                const typeIsHQ = type === 'HQ'
                const canAfford = checkAfford(facilityConf.basePrice)
                const isBlocked = !typeIsHQ && slots.isFull
                const actionState = {
                  canSell: facilityData.count > (type === 'HQ' ? 1 : 0),
                  sellPrice: Math.floor(facilityConf.basePrice / 2),
                  isDisabled: loadingState || !canAfford || isBlocked,
                  buttonText:
                    !canAfford ? 'Fondos Insuficientes' :
                    isBlocked ? 'Sin cupo (Expande el HQ)' :
                    typeIsHQ ? 'Expandir Sede' : 'Construir Instalación'
                }

                return (


                  <ActionCard
                    key={type}
                    facilityConf={facilityConf}
                    actionState={actionState}
                    onAction={() => executeAction(buyFacility(type))}
                    onSell={() => executeAction(sellFacility(type))}
                    isLoading={loadingState}
                  />

                  
                )
              })}
            </div>
          </div>
        ) : staffData && staffConf ? (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
              <span>👥</span> Recursos Humanos
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


              <StaffActionCard
                staffConf={staffConf}
                staffState={{
                  staffCount: staffData.count,
                  maxSpace: staffData[`${staffData.role}_SNAP`].capacityLimit - staffData.count,
                  playerCash: player.liquidCash
                }}
                onAction={(quantity) => executeAction(hireStaff(staffData.role, quantity))}
                onSell={(quantity) => executeAction(fireStaff(staffData.role, quantity))}
                isLoading={loadingState}
              />


            </div>
          </div>
        ) : null}

        <ModuleSection buildingData={buildingData} />
      </div>
    </div>
  )
}
