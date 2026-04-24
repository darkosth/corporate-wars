'use client'
import React, { useState, useEffect } from 'react'

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const formatMoney = (value) => (value || 0).toLocaleString('en-US')

export default function StaffActionCard({ 
  title, subtitle, emoji, cost, revenue, expense, 
  onAction, onSell, isLoading, maxSpace, playerCash, staffCount 
}) {
  // Estado de las pestañas
  const [mode, setMode] = useState('hire') // 'hire' o 'fire'
  const [qty, setQty] = useState(1)

  // Reseteamos el slider a 1 cada vez que el usuario cambia de pestaña
  useEffect(() => {
    setQty(1)
  }, [mode])

  // 1. Cálculos de Límites Dinámicos según la pestaña
  const maxAffordable = Math.floor(playerCash / cost);
  const maxHire = Math.max(0, Math.min(maxSpace, maxAffordable)); 
  const maxFire = staffCount || 0;
  
  const currentMax = mode === 'hire' ? maxHire : maxFire;
  const safeQty = Math.max(1, Math.min(qty, currentMax === 0 ? 1 : currentMax));
  
  // Validaciones de bloqueo
  const isBlocked = currentMax <= 0;
  const noFunds = mode === 'hire' && maxAffordable <= 0;
  const noSpace = mode === 'hire' && maxSpace <= 0;
  const nobodyToFire = mode === 'fire' && staffCount <= 0;

  // 2. Cálculos Financieros Dinámicos
  const totalRevenue = revenue * safeQty;
  const totalExpense = expense * safeQty;
  const baseNetFlow = totalRevenue - totalExpense;
  
  // Si despedimos, el impacto en el flujo es el inverso (ej: dejas de ganar 1200)
  const flowImpact = mode === 'hire' ? baseNetFlow : -baseNetFlow;
  const isFlowPositive = flowImpact >= 0;

  // Cálculos de ticket final
  const totalInvestment = cost * safeQty;
  const totalRefund = Math.floor(cost / 2) * safeQty;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-600 hover:shadow-lg hover:shadow-black/50 group">
      
      {/* Cabecera */}
      <div className="flex gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
          {emoji}
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{subtitle}</p>
        </div>
      </div>

      {/* Control Segmentado (Pestañas) */}
      <div className="flex bg-neutral-950/80 p-1 rounded-lg mb-4 border border-neutral-800/50">
        <button 
          onClick={() => setMode('hire')}
          disabled={isLoading}
          className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-2 rounded-md transition-all ${
            mode === 'hire' ? 'bg-neutral-800 text-blue-400 shadow-sm' : 'text-neutral-600 hover:text-neutral-400'
          }`}
        >
          Contratar
        </button>
        <button 
          onClick={() => setMode('fire')}
          disabled={isLoading}
          className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-2 rounded-md transition-all ${
            mode === 'fire' ? 'bg-red-950/40 text-red-400 shadow-sm border border-red-900/30' : 'text-neutral-600 hover:text-neutral-400'
          }`}
        >
          Despedir
        </button>
      </div>

      {/* Slider de Cantidad */}
      <div className="mb-4 bg-neutral-950/80 p-3 rounded-lg border border-neutral-800/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            {mode === 'hire' ? 'Cantidad a Reclutar' : 'Cantidad a Despedir'}
          </span>
          <span className={`text-sm font-mono font-bold ${mode === 'hire' ? 'text-blue-400' : 'text-red-400'}`}>
            x{safeQty}
          </span>
        </div>
        
        <input 
          type="range" 
          min="1" 
          max={Math.max(1, currentMax)} 
          value={safeQty}
          onChange={(e) => setQty(Number(e.target.value))}
          disabled={isBlocked || isLoading}
          className={`w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'hire' ? 'accent-blue-500' : 'accent-red-500'}`}
        />
        
        <div className="flex justify-between mt-1">
          <button onClick={() => setQty(1)} disabled={isBlocked || isLoading} className="text-[9px] uppercase text-neutral-500 hover:text-white">Min</button>
          <button onClick={() => setQty(currentMax)} disabled={isBlocked || isLoading} className="text-[9px] uppercase text-neutral-500 hover:text-white">Max ({currentMax})</button>
        </div>
      </div>

      {/* Proyección Dinámica (Se invierte si despides) */}
      <div className="space-y-2 mb-4 bg-neutral-950/50 p-3 rounded-lg border border-neutral-800/50">
        <div className="flex justify-between items-center opacity-60">
          <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
            {mode === 'hire' ? 'Ingreso Bruto Est.' : 'Ingreso Perdido'}
          </span>
          <span className={`text-xs font-mono ${mode === 'hire' ? 'text-emerald-400' : 'text-red-400'}`}>
            {mode === 'hire' ? '+' : '-'}${formatMoney(totalRevenue)}/h
          </span>
        </div>
        
        <div className="flex justify-between items-center opacity-60">
          <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
            {mode === 'hire' ? 'Nómina Est.' : 'Nómina Ahorrada'}
          </span>
          <span className={`text-xs font-mono ${mode === 'hire' ? 'text-red-400' : 'text-emerald-400'}`}>
            {mode === 'hire' ? '-' : '+'}${formatMoney(totalExpense)}/h
          </span>
        </div>

        <div className="flex justify-between items-center border-t border-neutral-800/50 pt-2 mt-2">
          <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">Impacto Flujo Neto</span>
          <span className={`text-sm font-mono font-bold drop-shadow-[0_0_5px_currentColor] ${isFlowPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isFlowPositive ? '+' : '-'}${formatMoney(Math.abs(flowImpact))}/h
          </span>
        </div>
      </div>

      {/* Bloque de Acción Final */}
      <div className="mt-auto">
        <div className={`mb-3 p-3 rounded-lg border flex justify-between items-center ${
          mode === 'hire' ? 'bg-blue-950/20 border-blue-900/30' : 'bg-emerald-950/20 border-emerald-900/30'
        }`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${mode === 'hire' ? 'text-blue-400' : 'text-emerald-400'}`}>
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
            className="relative w-full bg-neutral-800 border border-neutral-700 hover:border-blue-500 hover:bg-blue-900/20 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase text-xs tracking-widest"
          >
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              {noSpace ? 'Sin espacio físico' : noFunds ? 'Fondos Insuficientes' : `Firmar ${safeQty} Contrato(s)`}
            </span>
            {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
          </button>
        ) : (
          <button
            onClick={() => onSell(safeQty)}
            disabled={nobodyToFire || isLoading}
            className="relative w-full bg-red-950/20 border border-red-900/50 hover:border-red-500 hover:bg-red-900/40 text-red-400 font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase text-xs tracking-widest"
          >
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              {nobodyToFire ? 'Sin personal para despedir' : `Despedir ${safeQty} Empleado(s)`}
            </span>
            {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
          </button>
        )}
      </div>
    </div>
  )
}