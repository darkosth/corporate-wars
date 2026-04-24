import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import prisma from '../../utils/prisma'
import TopBar from '../../components/TopBar'
import Sidebar from '../../components/Sidebar' // <-- NUEVO
import Inventory from '../../components/Inventory'
import DashboardControls from '../../components/DashboardControls'
import SettingsModal from '@/components/SettingsModal'
import { syncCompanyEconomy, calculateGameState } from '../../utils/gameEngine' 

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const ShowSettings = params.settings === 'true'
  
  // NUEVO: Leemos en qué pestaña estamos (por defecto 'overview')
  const currentTab = params.tab || 'overview' 

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) redirect('/login')

  let company = await prisma.company.findUnique({ where: { ownerId: user.id } })

  if (!company) {
    company = await prisma.company.create({
      data: {
        ownerId: user.id,
        companyName: `Corp-${user.id.substring(0, 6).toUpperCase()}`,
        ceoName: "CEO Principal",
        liquidCash: 100000.0,
        hqCount: 1,
        hqLevel: 1,
      }
    })
  } else {
    company = await syncCompanyEconomy(user.id) 
  }

  if (!company) return <div>Error loading company data.</div>

  const gameState = calculateGameState(company)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans flex flex-col overflow-hidden">
      <TopBar 
        companyName={gameState.player.companyName} 
        ceoName={gameState.player.name}
        initialLiquidCash={gameState.player.liquidCash}
        stats={gameState.finances}
      />

      {/* NUEVO LAYOUT: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Menú Lateral */}
        <Sidebar currentTab={currentTab} />

        {/* Contenedor Principal (Con scroll propio) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#0a0a0a]">
          
          {currentTab === 'overview' ? (
            <div className="animate-in fade-in duration-500">
              <header className="mb-8">
                <h2 className="text-3xl font-light text-white">Resumen Ejecutivo</h2>
                <p className="text-neutral-500">Visión global de tu imperio corporativo y métricas clave.</p>
              </header>
              <Inventory infrastructure={gameState.infrastructure} staff={gameState.staff} />
            </div>
          ) : (
            <DashboardControls 
              currentTab={currentTab} 
              player={gameState.player}
              infrastructure={gameState.infrastructure}
              staff={gameState.staff}
            />
          )}

        </main>
      </div>

      { ShowSettings && (
        <SettingsModal currentCompany={gameState.player.companyName} currentCeo={gameState.player.name} isOpen={true} />
      )}
    </div>
  )
}