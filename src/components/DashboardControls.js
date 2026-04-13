'use client'

import { useState } from 'react'
import { buyFacility, hireStaff } from '../app/dashboard/actions'
import { BUILDINGS, EMPLOYEES } from '../game/constants'
import { sanitizeNumber } from '../utils/company'

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const formatAmount = (value, options = {}) => sanitizeNumber(value, 0, options).toLocaleString('en-US')

const ActionCard = ({ title, subtitle, emoji, cost, revenue, expense, onAction, isLoading, isDisabled, buttonText }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-600 hover:shadow-lg hover:shadow-black/50 group">
    <div className="flex gap-4 mb-6">
      <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
        {emoji}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </div>

    <div className="space-y-2 mb-6 bg-neutral-950/50 p-3 rounded-lg border border-neutral-800/50">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Costo Inicial</span>
        <span className="text-sm font-mono text-white">${formatAmount(cost, { min: 0 })}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Ganancias Generadas </span>
        <span className="text-sm font-mono text-white">${formatAmount(revenue, { min: 0 })}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Costo de Operación</span>
        <span className="text-sm font-mono text-white">${formatAmount(expense, { min: 0 })}</span>
      </div>
      {(sanitizeNumber(revenue, 0) > 0 || sanitizeNumber(expense, 0) > 0) && (
        <div className="flex justify-between items-center border-t border-neutral-800/50 pt-2 mt-2">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Flujo Neto</span>
          <span className={`text-sm font-mono ${sanitizeNumber(revenue, 0) - sanitizeNumber(expense, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {sanitizeNumber(revenue, 0) - sanitizeNumber(expense, 0) >= 0 ? '+' : ''}${formatAmount(sanitizeNumber(revenue, 0) - sanitizeNumber(expense, 0))}/h
          </span>
        </div>
      )}
    </div>

    <button
      onClick={onAction}
      disabled={isDisabled || isLoading}
      className="relative w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
    >
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{buttonText}</span>
      {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
    </button>
  </div>
)

export default function DashboardControls({ liquidCash, facilities, employees, capacities, officeSlotsUnlocked, levels }) {
  const [error, setError] = useState(null)
  const [loadingStates, setLoadingStates] = useState({
    hq: false,
    office: false,
    dataCenter: false,
    basement: false,
    programmer: false,
    analyst: false,
    saboteur: false
  })

  const executeAction = async (actionFn, actionKey) => {
    setLoadingStates(prev => ({ ...prev, [actionKey]: true }))
    const result = await actionFn()

    if (result?.error) setError(result.error)
    else setError(null)

    setLoadingStates(prev => ({ ...prev, [actionKey]: false }))
  }

  const isAnyLoading = Object.values(loadingStates).some(state => state)

  const safeLevels = {
    HQ: sanitizeNumber(levels?.HQ, 1, { min: 1 }),
    OFFICE: sanitizeNumber(levels?.OFFICE, 1, { min: 1 }),
    DATACENTER: sanitizeNumber(levels?.DATACENTER, 1, { min: 1 }),
    BASEMENT: sanitizeNumber(levels?.BASEMENT, 1, { min: 1 })
  }

  const hqData = BUILDINGS.HQ.levels[safeLevels.HQ] || BUILDINGS.HQ.levels[1]
  const officeData = BUILDINGS.OFFICE.levels[safeLevels.OFFICE] || BUILDINGS.OFFICE.levels[1]
  const dataCenterData = BUILDINGS.DATACENTER.levels[safeLevels.DATACENTER] || BUILDINGS.DATACENTER.levels[1]
  const basementData = BUILDINGS.BASEMENT.levels[safeLevels.BASEMENT] || BUILDINGS.BASEMENT.levels[1]

  const safeLiquidCash = sanitizeNumber(liquidCash, 0, { min: 0 })
  const safeFacilities = {
    HQ: sanitizeNumber(facilities?.HQ, 0, { min: 0 }),
    OFFICE: sanitizeNumber(facilities?.OFFICE, 0, { min: 0 }),
    DATACENTER: sanitizeNumber(facilities?.DATACENTER, 0, { min: 0 }),
    BASEMENT: sanitizeNumber(facilities?.BASEMENT, 0, { min: 0 })
  }
  const safeEmployees = {
    PROGRAMMER: sanitizeNumber(employees?.PROGRAMMER, 0, { min: 0 }),
    ANALYST: sanitizeNumber(employees?.ANALYST, 0, { min: 0 }),
    SABOTEUR: sanitizeNumber(employees?.SABOTEUR, 0, { min: 0 })
  }
  const safeCapacities = {
    OFFICE: sanitizeNumber(capacities?.OFFICE, 0, { min: 0 }),
    DATACENTER: sanitizeNumber(capacities?.DATACENTER, 0, { min: 0 }),
    BASEMENT: sanitizeNumber(capacities?.BASEMENT, 0, { min: 0 })
  }
  const safeOfficeSlotsUnlocked = sanitizeNumber(officeSlotsUnlocked, 0, { min: 0 })

  const canAffordHq = safeLiquidCash >= BUILDINGS.HQ.basePrice
  const canAffordOffice = safeLiquidCash >= BUILDINGS.OFFICE.basePrice
  const canAffordDataCenter = safeLiquidCash >= BUILDINGS.DATACENTER.basePrice
  const canAffordBasement = safeLiquidCash >= BUILDINGS.BASEMENT.basePrice
  const hasOfficeSlotAvailable = safeFacilities.OFFICE < safeOfficeSlotsUnlocked

  const canAffordProgrammer = safeLiquidCash >= EMPLOYEES.PROGRAMMER.costToHire
  const hasspaceForProgrammer = safeEmployees.PROGRAMMER < safeCapacities.OFFICE

  const canAffordAnalyst = safeLiquidCash >= EMPLOYEES.ANALYST.costToHire
  const hasSpaceForAnalyst = safeEmployees.ANALYST < safeCapacities.DATACENTER

  const canAffordSaboteur = safeLiquidCash >= EMPLOYEES.SABOTEUR.costToHire
  const hasSpaceForSaboteur = safeEmployees.SABOTEUR < safeCapacities.BASEMENT

  return (
    <div className="pt-8">
      {error && (
        <div className="transition-all duration-300 overflow-hidden mb-6">
          <div className="p-4 bg-red-950/50 border border-red-800 text-red-400 rounded-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
          <span>🏗️</span> Infraestructura Corporativa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <ActionCard
            title={`${BUILDINGS.HQ.name} (Lv. ${safeLevels.HQ})`}
            subtitle={`Desbloquea hasta 5 offices por HQ. Actualmente tienes ${safeFacilities.HQ} HQ.`}
            emoji={BUILDINGS.HQ.emoji}
            cost={BUILDINGS.HQ.basePrice}
            revenue={hqData.revenue}
            expense={hqData.maintenance}
            onAction={() => executeAction(() => buyFacility('HQ'), 'hq')}
            isLoading={loadingStates.hq}
            isDisabled={isAnyLoading || !canAffordHq}
            buttonText={!canAffordHq ? 'Fondos Insuficientes' : 'Comprar HQ'}
          />

          <ActionCard
            title={`${BUILDINGS.OFFICE.name} (Lv. ${safeLevels.OFFICE})`}
            subtitle={`${safeFacilities.OFFICE} / ${safeOfficeSlotsUnlocked} offices ocupados. ${BUILDINGS.OFFICE.description}`}
            emoji={BUILDINGS.OFFICE.emoji}
            cost={BUILDINGS.OFFICE.basePrice}
            revenue={officeData.revenue}
            expense={officeData.maintenance}
            onAction={() => executeAction(() => buyFacility('OFFICE'), 'office')}
            isLoading={loadingStates.office}
            isDisabled={isAnyLoading || !canAffordOffice || !hasOfficeSlotAvailable}
            buttonText={
              !canAffordOffice ? 'Fondos Insuficientes' :
              !hasOfficeSlotAvailable ? 'Sin cupo (Compra otro HQ)' :
              'Firmar Contrato'
            }
          />

          <ActionCard
            title={`${BUILDINGS.DATACENTER.name} (Lv. ${safeLevels.DATACENTER})`}
            subtitle={BUILDINGS.DATACENTER.description}
            emoji={BUILDINGS.DATACENTER.emoji}
            cost={BUILDINGS.DATACENTER.basePrice}
            revenue={dataCenterData.revenue}
            expense={dataCenterData.maintenance}
            onAction={() => executeAction(() => buyFacility('DATACENTER'), 'dataCenter')}
            isLoading={loadingStates.dataCenter}
            isDisabled={isAnyLoading || !canAffordDataCenter}
            buttonText={!canAffordDataCenter ? 'Fondos Insuficientes' : 'Firmar Contrato'}
          />

          <ActionCard
            title={`${BUILDINGS.BASEMENT.name} (Lv. ${safeLevels.BASEMENT})`}
            subtitle={BUILDINGS.BASEMENT.description}
            emoji={BUILDINGS.BASEMENT.emoji}
            cost={BUILDINGS.BASEMENT.basePrice}
            revenue={basementData.revenue}
            expense={basementData.maintenance}
            onAction={() => executeAction(() => buyFacility('BASEMENT'), 'basement')}
            isLoading={loadingStates.basement}
            isDisabled={isAnyLoading || !canAffordBasement}
            buttonText={!canAffordBasement ? 'Fondos Insuficientes' : 'Firmar Contrato'}
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
          <span>👥</span> Capital Humano
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title={EMPLOYEES.PROGRAMMER.name}
            subtitle={EMPLOYEES.PROGRAMMER.description}
            emoji={EMPLOYEES.PROGRAMMER.emoji}
            cost={EMPLOYEES.PROGRAMMER.costToHire}
            revenue={EMPLOYEES.PROGRAMMER.revenuePerHour}
            expense={EMPLOYEES.PROGRAMMER.salaryPerHour}
            onAction={() => executeAction(() => hireStaff('PROGRAMMER'), 'programmer')}
            isLoading={loadingStates.programmer}
            isDisabled={isAnyLoading || !canAffordProgrammer || !hasspaceForProgrammer}
            buttonText={
              !canAffordProgrammer ? 'Fondos Insuficientes' :
              !hasspaceForProgrammer ? 'Sin Espacio (Alquila más oficinas)' :
              'Reclutar'
            }
          />

          <ActionCard
            title={EMPLOYEES.ANALYST.name}
            subtitle={EMPLOYEES.ANALYST.description}
            emoji={EMPLOYEES.ANALYST.emoji}
            cost={EMPLOYEES.ANALYST.costToHire}
            revenue={EMPLOYEES.ANALYST.revenuePerHour}
            expense={EMPLOYEES.ANALYST.salaryPerHour}
            onAction={() => executeAction(() => hireStaff('ANALYST'), 'analyst')}
            isLoading={loadingStates.analyst}
            isDisabled={isAnyLoading || !canAffordAnalyst || !hasSpaceForAnalyst}
            buttonText={
              !canAffordAnalyst ? 'Fondos Insuficientes' :
              !hasSpaceForAnalyst ? 'Sin Espacio (Alquila más centros de datos)' :
              'Reclutar'
            }
          />

          <ActionCard
            title={EMPLOYEES.SABOTEUR.name}
            subtitle={EMPLOYEES.SABOTEUR.description}
            emoji={EMPLOYEES.SABOTEUR.emoji}
            cost={EMPLOYEES.SABOTEUR.costToHire}
            revenue={EMPLOYEES.SABOTEUR.revenuePerHour}
            expense={EMPLOYEES.SABOTEUR.salaryPerHour}
            onAction={() => executeAction(() => hireStaff('SABOTEUR'), 'saboteur')}
            isLoading={loadingStates.saboteur}
            isDisabled={isAnyLoading || !canAffordSaboteur || !hasSpaceForSaboteur}
            buttonText={
              !canAffordSaboteur ? 'Fondos Insuficientes' :
              !hasSpaceForSaboteur ? 'Sin Espacio (Alquila más oficinas)' :
              'Reclutar'
            }
          />
        </div>
      </div>
    </div>
  )
}
