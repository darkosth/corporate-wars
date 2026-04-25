'use client'

import React, { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

const formatMoney = (value) => (value || 0).toLocaleString('en-US')

export default function StaffActionCard({ staffConf, staffState, onAction, onSell, isLoading }) {
  const [mode, setMode] = useState('hire')
  const [qty, setQty] = useState(1)

  const maxAffordable = Math.floor(staffState.playerCash / staffConf.costToHire)
  const maxHire = Math.max(0, Math.min(staffState.maxSpace, maxAffordable))
  const maxFire = staffState.staffCount || 0

  const currentMax = mode === 'hire' ? maxHire : maxFire
  const safeQty = Math.max(1, Math.min(qty, currentMax === 0 ? 1 : currentMax))

  const isBlocked = currentMax <= 0
  const noFunds = mode === 'hire' && maxAffordable <= 0
  const noSpace = mode === 'hire' && staffState.maxSpace <= 0
  const nobodyToFire = mode === 'fire' && staffState.staffCount <= 0

  const totalRevenue = staffConf.revenue * safeQty
  const totalExpense = staffConf.salary * safeQty
  const baseNetFlow = totalRevenue - totalExpense
  const flowImpact = mode === 'hire' ? baseNetFlow : -baseNetFlow
  const isFlowPositive = flowImpact >= 0

  const totalInvestment = staffConf.costToHire * safeQty
  const totalRefund = Math.floor(staffConf.costToHire / 2) * safeQty

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setQty(1)
  }

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-neutral-600 hover:shadow-lg hover:shadow-black/50">
      <div className="mb-4 flex gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-3xl shadow-inner transition-transform group-hover:scale-105">
          {staffConf.emoji}
        </div>
        <div>
          <h3 className="text-lg font-bold leading-tight text-white">{staffConf.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-400">{staffConf.description}</p>
        </div>
      </div>

      <div className="mb-4 flex rounded-lg border border-neutral-800/50 bg-neutral-950/80 p-1">
        <button
          onClick={() => handleModeChange('hire')}
          disabled={isLoading}
          className={`flex-1 rounded-md py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
            mode === 'hire' ? 'bg-neutral-800 text-blue-400 shadow-sm' : 'text-neutral-600 hover:text-neutral-400'
          }`}
        >
          Contratar
        </button>
        <button
          onClick={() => handleModeChange('fire')}
          disabled={isLoading}
          className={`flex-1 rounded-md py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
            mode === 'fire'
              ? 'border border-red-900/30 bg-red-950/40 text-red-400 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-400'
          }`}
        >
          Despedir
        </button>
      </div>

      <div className="mb-4 rounded-lg border border-neutral-800/50 bg-neutral-950/80 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {mode === 'hire' ? 'Cantidad a Reclutar' : 'Cantidad a Despedir'}
          </span>
          <span className={`text-sm font-bold font-mono ${mode === 'hire' ? 'text-blue-400' : 'text-red-400'}`}>
            x{safeQty}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max={Math.max(1, currentMax)}
          value={safeQty}
          onChange={(event) => setQty(Number(event.target.value))}
          disabled={isBlocked || isLoading}
          className={`w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === 'hire' ? 'accent-blue-500' : 'accent-red-500'
          }`}
        />

        <div className="mt-1 flex justify-between">
          <button
            onClick={() => setQty(1)}
            disabled={isBlocked || isLoading}
            className="text-[9px] uppercase text-neutral-500 hover:text-white"
          >
            Min
          </button>
          <button
            onClick={() => setQty(currentMax)}
            disabled={isBlocked || isLoading}
            className="text-[9px] uppercase text-neutral-500 hover:text-white"
          >
            Max ({currentMax})
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-2 rounded-lg border border-neutral-800/50 bg-neutral-950/50 p-3">
        <div className="flex items-center justify-between opacity-60">
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
            {mode === 'hire' ? 'Ingreso Bruto Est.' : 'Ingreso Perdido'}
          </span>
          <span className={`text-xs font-mono ${mode === 'hire' ? 'text-emerald-400' : 'text-red-400'}`}>
            {mode === 'hire' ? '+' : '-'}${formatMoney(totalRevenue)}/h
          </span>
        </div>

        <div className="flex items-center justify-between opacity-60">
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
            {mode === 'hire' ? 'Nómina Est.' : 'Nómina Ahorrada'}
          </span>
          <span className={`text-xs font-mono ${mode === 'hire' ? 'text-red-400' : 'text-emerald-400'}`}>
            {mode === 'hire' ? '-' : '+'}${formatMoney(totalExpense)}/h
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-neutral-800/50 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Impacto Flujo Neto</span>
          <span
            className={`text-sm font-bold font-mono drop-shadow-[0_0_5px_currentColor] ${
              isFlowPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isFlowPositive ? '+' : '-'}${formatMoney(Math.abs(flowImpact))}/h
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <div
          className={`mb-3 flex items-center justify-between rounded-lg border p-3 ${
            mode === 'hire' ? 'border-blue-900/30 bg-blue-950/20' : 'border-emerald-900/30 bg-emerald-950/20'
          }`}
        >
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              mode === 'hire' ? 'text-blue-400' : 'text-emerald-400'
            }`}
          >
            {mode === 'hire' ? 'Inversión Requerida' : 'Recuperación (Liquidación)'}
          </span>
          <span className="text-lg font-black font-mono text-white">
            ${formatMoney(mode === 'hire' ? totalInvestment : totalRefund)}
          </span>
        </div>

        {mode === 'hire' ? (
          <button
            onClick={() => onAction(safeQty)}
            disabled={isBlocked || isLoading}
            className="relative w-full rounded-lg border border-neutral-700 bg-neutral-800 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 hover:border-blue-500 hover:bg-blue-900/20"
          >
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              {noSpace ? 'Sin espacio físico' : noFunds ? 'Fondos Insuficientes' : `Firmar ${safeQty} Contrato(s)`}
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => onSell(safeQty)}
            disabled={nobodyToFire || isLoading}
            className="relative w-full rounded-lg border border-red-900/50 bg-red-950/20 py-3 text-xs font-bold uppercase tracking-widest text-red-400 transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 hover:border-red-500 hover:bg-red-900/40"
          >
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              {nobodyToFire ? 'Sin personal para despedir' : `Despedir ${safeQty} Empleado(s)`}
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
