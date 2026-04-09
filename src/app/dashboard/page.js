// src/app/dashboard/page.js
import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import prisma from '../../utils/prisma'

export default async function DashboardPage() {
  // 1. Verificamos quién está intentando entrar
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // Si no está logueado, patada de vuelta al login
  if (error || !user) {
    redirect('/login')
  }

  // 2. Buscamos su empresa en la base de datos
  let company = await prisma.company.findUnique({
    where: { ownerId: user.id }
  })

  // 3. Si es nuevo y no tiene empresa, ¡se la creamos al instante!
  if (!company) {
    company = await prisma.company.create({
      data: {
        ownerId: user.id,
        // Le damos un nombre temporal usando parte de su ID
        companyName: `Corp-${user.id.substring(0, 6).toUpperCase()}`,
        liquidCash: 100000.0, // El capital semilla
        revenuePerHour: 1500.0, // El trabajo del CEO
        expensesPerHour: 0.0,
      }
    })
  }

  // 4. La Interfaz Visual (Tu Cuartel General)
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans">
      
      {/* Barra Superior */}
      <nav className="border-b border-neutral-800 bg-neutral-900 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-widest">{company.companyName}</h1>
          <p className="text-xs text-neutral-500">CEO: {user.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <button className="text-sm bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded transition-colors text-red-400">
            Desconectar
          </button>
        </form>
      </nav>

      {/* Panel Principal */}
      <main className="p-6 max-w-6xl mx-auto space-y-6 mt-8">
        
        <header className="mb-10">
          <h2 className="text-3xl font-light text-white">Resumen Financiero</h2>
          <p className="text-neutral-500">Los mercados nunca duermen.</p>
        </header>

        {/* Tarjetas de Economía */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta de Liquidez */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Liquidez Neta (Bóveda)</h3>
            <p className="text-4xl font-bold text-white">
              ${company.liquidCash.toLocaleString('en-US')}
            </p>
          </div>

          {/* Tarjeta de Ingresos */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Generación Bruta</h3>
            <p className="text-3xl font-bold text-blue-400">
              +${company.revenuePerHour.toLocaleString('en-US')} <span className="text-sm font-normal text-neutral-500">/ hora</span>
            </p>
          </div>

          {/* Tarjeta de Gastos */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Gastos Operativos (Salarios)</h3>
            <p className="text-3xl font-bold text-red-400">
              -${company.expensesPerHour.toLocaleString('en-US')} <span className="text-sm font-normal text-neutral-500">/ hora</span>
            </p>
          </div>

        </div>

        {/* Botones de acción falsos para el MVP */}
        <div className="pt-8 flex gap-4">
          <button className="bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-white px-6 py-3 rounded opacity-50 cursor-not-allowed">
            Alquilar Oficina (-$15,000)
          </button>
          <button className="bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-white px-6 py-3 rounded opacity-50 cursor-not-allowed">
            Contratar Programador (-$800/h)
          </button>
        </div>

      </main>
    </div>
  )
}