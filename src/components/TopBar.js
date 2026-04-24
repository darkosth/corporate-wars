'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// el Engine manda los números limpios sin formato, así que aquí los formateamos para mostrar
const formatMoney = (value) => Math.floor(value || 0).toLocaleString('en-US')

export default function TopBar({ companyName, ceoName, initialLiquidCash, stats }) {
  const [currentCash, setCurrentCash] = useState(initialLiquidCash)

  // Sincroniza el dinero inicial cuando carga o actualiza la base de datos
  useEffect(() => {
    setCurrentCash(initialLiquidCash)
  }, [initialLiquidCash])

  // El famoso "Motor de Tiempo" visual (Ticker)
  useEffect(() => {
    const cashPerSecond = (stats?.netFlowPerHour || 0) / 3600
    const timer = setInterval(() => {
      setCurrentCash((cash) => cash + cashPerSecond)
    }, 1000)

    return () => clearInterval(timer)
  }, [stats?.netFlowPerHour])

  // Determinamos si estamos en ganancias o pérdidas para el estilo visual
  const isPositive = (stats?.netFlowPerHour || 0) >= 0

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-950 border-b border-neutral-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black text-white tracking-wider uppercase">
              {companyName}
            </h1>
            <p className="text-xs text-neutral-500 font-mono">CEO: {ceoName}</p>
          </div>

          <div className="flex items-center gap-4">
            
            {/*Gross Generation*/}
            <div className={`flex flex-col items-end px-3 py-1 rounded border ${isPositive ? 'border-emerald-900/50 bg-emerald-950/20' : 'border-red-900/50 bg-red-950/20'}`}>
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
                Gross Generation
              </span>
              <span className={`text-sm font-bold font-mono ${isPositive ? 'text-blue-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}${formatMoney(stats?.revenuePerHour)}/h
              </span>
            </div>

            {/*Operating Expenses*/}
            <div className={`flex flex-col items-end px-3 py-1 rounded border ${isPositive ? 'border-emerald-900/50 bg-emerald-950/20' : 'border-red-900/50 bg-red-950/20'}`}>
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
                Operating Expenses
              </span>
              <span className={`text-sm font-bold font-mono ${!isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '-' : ''}${formatMoney(stats?.expensesPerHour)}/h
              </span>
            </div>

            {/*Net Flow*/}
            <div className={`flex flex-col items-end px-3 py-1 rounded border ${isPositive ? 'border-emerald-900/50 bg-emerald-950/20' : 'border-red-900/50 bg-red-950/20'}`}>
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">
                Net Flow
              </span>
              <span className={`text-sm font-bold font-mono ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}${formatMoney(stats?.netFlowPerHour)}/h
              </span>
            </div>

            {/*Liquid Cash*/}
            <div className="flex flex-col items-end bg-neutral-900 px-4 py-1 rounded border border-neutral-800 shadow-inner min-w-[160px]">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                Bóveda
              </span>
              <span className="text-xl font-mono font-bold text-white tracking-tighter">
                ${formatMoney(currentCash)}
              </span>
            </div>

            <Link 
              href="?settings=true"
              className="bg-neutral-800 p-2 rounded hover:bg-neutral-700 text-neutral-400 transition-colors"
              title='Configuration'
            >
              ⚙️
            </Link>

            <form action="/auth/signout" method="post">
              <button className="text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 px-3 py-2 rounded transition-all">
                SALIR
              </button>
            </form>

          </div>
        </div>
      </div>
    </nav>
  )
}