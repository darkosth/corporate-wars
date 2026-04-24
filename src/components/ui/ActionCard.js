import React from 'react'

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const formatAmount = (value) => (value || 0).toLocaleString('en-US')

export default function ActionCard({ 
  title, subtitle, emoji, cost, revenue, expense, 
  onAction, isLoading, isDisabled, buttonText,
  // NUEVAS PROPS AÑADIDAS PARA LA LIQUIDACIÓN
  onSell, canSell, sellPrice 
}) {
  const netFlow = (revenue || 0) - (expense || 0)
  const isPositive = netFlow >= 0

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-600 hover:shadow-lg hover:shadow-black/50 group">
      {/* Cabecera */}
      <div className="flex gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
          {emoji}
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{subtitle}</p>
        </div>
      </div>

      {/* Finanzas (Tu desglose original intacto) */}
      <div className="space-y-2 mb-6 bg-neutral-950/50 p-3 rounded-lg border border-neutral-800/50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Costo Inicial</span>
          <span className="text-sm font-mono text-white">${formatAmount(cost)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Ingresos</span>
          <span className="text-sm font-mono text-white">${formatAmount(revenue)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Gastos</span>
          <span className="text-sm font-mono text-white">${formatAmount(expense)}</span>
        </div>
        {(revenue > 0 || expense > 0) && (
          <div className="flex justify-between items-center border-t border-neutral-800/50 pt-2 mt-2">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Flujo Neto</span>
            <span className={`text-sm font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${formatAmount(netFlow)}/h
            </span>
          </div>
        )}
      </div>

      {/* Contenedor de Botones (Acción Principal + Venta) */}
      <div className="flex flex-col gap-2 mt-auto">
        
        {/* Botón Principal (Comprar/Construir) */}
        <button
          onClick={onAction}
          disabled={isDisabled || isLoading}
          className="relative w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{buttonText}</span>
          {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
        </button>

        {/* Botón Secundario (Vender) - Solo se renderiza si pasamos la prop onSell */}
        {onSell && (
          <button
            onClick={onSell}
            disabled={!canSell || isLoading}
            className="w-full bg-transparent border border-red-900/40 hover:border-red-500 hover:bg-red-950/40 text-red-400 font-bold py-2 rounded-lg transition-all text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:pointer-events-none"
          >
            Liquidación (+${formatAmount(sellPrice)})
          </button>
        )}
        
      </div>
    </div>
  )
}