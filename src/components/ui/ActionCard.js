import React from 'react'
import LoadingSpinner from './LoadingSpinner'

const formatAmount = (value) => (value || 0).toLocaleString('en-US')

export default function ActionCard({ facilityConf, actionState, onAction, onSell, isLoading }) {
  const netFlow = (facilityConf.baseRevenue || 0) - (facilityConf.baseMaintenance || 0)
  const isPositive = netFlow >= 0

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-neutral-600 hover:shadow-lg hover:shadow-black/50">
      <div className="mb-6 flex gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-3xl shadow-inner transition-transform group-hover:scale-105">
          {facilityConf.emoji}
        </div>
        <div>
          <h3 className="text-lg font-bold leading-tight text-white">{facilityConf.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-400">{facilityConf.description}</p>
        </div>
      </div>

      <div className="mb-6 space-y-2 rounded-lg border border-neutral-800/50 bg-neutral-950/50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Costo Inicial</span>
          <span className="text-sm font-mono text-white">${formatAmount(facilityConf.basePrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Ingresos</span>
          <span className="text-sm font-mono text-white">${formatAmount(facilityConf.baseRevenue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Gastos</span>
          <span className="text-sm font-mono text-white">${formatAmount(facilityConf.baseMaintenance)}</span>
        </div>
        {(facilityConf.baseRevenue > 0 || facilityConf.baseMaintenance > 0) && (
          <div className="mt-2 flex items-center justify-between border-t border-neutral-800/50 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Flujo Neto</span>
            <span className={`text-sm font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${formatAmount(netFlow)}/h
            </span>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onAction}
          disabled={actionState.isDisabled || isLoading}
          className="relative w-full rounded-lg border border-neutral-700 bg-neutral-800 py-3 font-bold text-white transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 hover:border-neutral-500 hover:bg-neutral-700"
        >
          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{actionState.buttonText}</span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </button>

        {onSell && (
          <button
            onClick={onSell}
            disabled={!actionState.canSell || isLoading}
            className="w-full rounded-lg border border-red-900/40 bg-transparent py-2 text-[10px] font-bold uppercase tracking-widest text-red-400 transition-all disabled:pointer-events-none disabled:opacity-30 hover:border-red-500 hover:bg-red-950/40"
          >
            Liquidación (+${formatAmount(actionState.sellPrice)})
          </button>
        )}
      </div>
    </div>
  )
}
