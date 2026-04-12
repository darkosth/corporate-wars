// src/components/DashboardControls.js
'use client'

import { useState } from 'react'
import { buyFacility, hireStaff } from '../app/dashboard/actions'
import { BUILDINGS, EMPLOYEES } from '../game/constants' 

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

// COMPONENTE DE UI: La Tarjeta de Compra/Contratación
const ActionCard = ({ title, subtitle, emoji, cost, revenue, expense, onAction, isLoading, isDisabled, buttonText }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-600 hover:shadow-lg hover:shadow-black/50 group">
    
    {/* Cabecera: Imagen y Textos */}
    <div className="flex gap-4 mb-6">
      {/* ESPACIO PARA LA FOTO: Por ahora un cuadro con emoji, luego pones la etiqueta <img /> aquí */}
      <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
        {emoji}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </div>

    {/* Finanzas: Costo y Retorno */}
    <div className="space-y-2 mb-6 bg-neutral-950/50 p-3 rounded-lg border border-neutral-800/50">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Costo Inicial</span>
        <span className="text-sm font-mono text-white">${cost.toLocaleString('en-US')}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Ganancias Generadas </span>
        <span className="text-sm font-mono text-white">${revenue.toLocaleString('en-US')}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Costo de Operación</span>
        <span className="text-sm font-mono text-white">${expense.toLocaleString('en-US')}</span>
      </div>
      {(revenue > 0 || expense > 0) && (
        <div className="flex justify-between items-center border-t border-neutral-800/50 pt-2 mt-2">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Flujo Neto</span>
          <span className={`text-sm font-mono ${revenue - expense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {revenue - expense >= 0 ? '+' : ''}${(revenue - expense).toLocaleString('en-US')}/h
          </span>
        </div>
      )}
    </div>

    {/* Botón de Acción */}
    <button 
      onClick={onAction}
      disabled={isDisabled || isLoading}
      className="relative w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
    >
      <span className={isLoading ? "opacity-0" : "opacity-100"}>{buttonText}</span>
      {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
    </button>
  </div>
)

export default function DashboardControls({ liquidCash, employees, capacities }) {
  const [error, setError] = useState(null)
  const [loadingStates, setLoadingStates] = useState({
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

  //VALIDACIONES DE INFRAESTRUCTURA
  const canAffordOffice = liquidCash >= BUILDINGS.OFFICE.basePrice
  const canAffordDataCenter = liquidCash >= BUILDINGS.DATACENTER.basePrice
  const canAffordBasement = liquidCash >= BUILDINGS.BASEMENT.basePrice

  // VALIDACIONES DE CAPITAL HUMANO (Dinero + Capacidad)
  const canAffordProgrammer = liquidCash >= EMPLOYEES.PROGRAMMER.costToHire    //EMPLOYEES en mayuscula viene de las constantes, no del estado
  const hasspaceForProgrammer = employees.PROGRAMMER < capacities.OFFICE      //employees en minuscula viene del estado que se pasa como prop

  const canAffordAnalyst = liquidCash >= EMPLOYEES.ANALYST.costToHire         
  const hasSpaceForAnalyst = employees.ANALYST < capacities.DATACENTER

  const canAffordSaboteur = liquidCash >= EMPLOYEES.SABOTEUR.costToHire
  const hasSpaceForSaboteur = employees.SABOTEUR < capacities.BASEMENT

  return (
    <div className="pt-8">
      {error && (
        <div className={`transition-all duration-300 overflow-hidden mb-6`}>
          <div className="p-4 bg-red-950/50 border border-red-800 text-red-400 rounded-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* SECCIÓN 1: INFRAESTRUCTURA */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
          <span>🏗️</span> Infraestructura Corporativa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard 
            title={BUILDINGS.OFFICE.name}
            subtitle={BUILDINGS.OFFICE.description}
            emoji={BUILDINGS.OFFICE.emoji}
            cost={BUILDINGS.OFFICE.basePrice}
            revenue={BUILDINGS.OFFICE.baseRevenue}
            expense={BUILDINGS.OFFICE.baseMaintenance}
            onAction={() => executeAction(() => buyFacility('OFFICE'), 'office')}
            isLoading={loadingStates.office}
            isDisabled={isAnyLoading || !canAffordOffice}
            buttonText={!canAffordOffice ? "Fondos Insuficientes" : "Firmar Contrato"}
          />

          <ActionCard 
            title={BUILDINGS.DATACENTER.name}
            subtitle={BUILDINGS.DATACENTER.description}
            emoji={BUILDINGS.DATACENTER.emoji}
            cost={BUILDINGS.DATACENTER.basePrice}
            revenue={BUILDINGS.DATACENTER.baseRevenue}
            expense={BUILDINGS.DATACENTER.baseMaintenance}
            onAction={() => executeAction(() => buyFacility('DATACENTER'), 'dataCenter')}
            isLoading={loadingStates.dataCenter}
            isDisabled={isAnyLoading || !canAffordDataCenter}
            buttonText={!canAffordDataCenter ? "Fondos Insuficientes" : "Firmar Contrato"}
          />

          <ActionCard 
            title={BUILDINGS.BASEMENT.name}
            subtitle={BUILDINGS.BASEMENT.description}
            emoji={BUILDINGS.BASEMENT.emoji}
            cost={BUILDINGS.BASEMENT.basePrice}
            revenue={BUILDINGS.BASEMENT.baseRevenue}
            expense={BUILDINGS.BASEMENT.baseMaintenance}
            onAction={() => executeAction(() => buyFacility('BASEMENT'), 'basement')}
            isLoading={loadingStates.basement}
            isDisabled={isAnyLoading || !canAffordBasement}
            buttonText={!canAffordBasement ? "Fondos Insuficientes" : "Firmar Contrato"}
          />
        </div>
      </div>

      {/* SECCIÓN 2: CAPITAL HUMANO */}
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
              !canAffordProgrammer ? "Fondos Insuficientes" :
              !hasspaceForProgrammer ? "Sin Espacio (Alquila más oficinas)" :
               "Reclutar"}
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
            buttonText= {
              !canAffordAnalyst ? "Fondos Insuficientes" :
              !hasSpaceForAnalyst ? "Sin Espacio (Alquila más centros de datos)" :
               "Reclutar"}
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
            buttonText= {
              !canAffordSaboteur ? "Fondos Insuficientes" :
              !hasSpaceForSaboteur ? "Sin Espacio (Alquila más oficinas)" :
               "Reclutar"}
          />
        </div>
      </div>
    </div>
  )
}