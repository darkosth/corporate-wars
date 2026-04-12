import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import prisma from '../../utils/prisma'
import TopBar from '../../components/TopBar'
import DashboardControls from '../../components/DashboardControls'
import Inventory from '../../components/Inventory'
import { BUILDINGS, EMPLOYEES } from '../../game/constants'
import SettingsModal from '@/components/SettingsModal'
import { syncCompanyEconomy, calculateCompanyStats } from '../../utils/economy'

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const ShowSettings = params.settings === 'true'
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // 1. Intentamos obtener la compañía inicialmente
  let company = await prisma.company.findUnique({
    where: { ownerId: user.id },
    include: { facilities: true }
  })

  // 2. Lógica de creación o sincronización
  if (!company) {
    company = await prisma.company.create({
      data: {
        ownerId: user.id,
        companyName: `Corp-${user.id.substring(0, 6).toUpperCase()}`,
        ceoName: "CEO Principal",
        liquidCash: 100000.0,
      },
      include: { facilities: true }
    })
  } else {
    // Sincronizamos la economía (intereses, ingresos pasivos, etc.)
    await syncCompanyEconomy(user.id)
    
    // Refrescamos los datos después de la sincronización para tener valores actuales
    company = await prisma.company.findUnique({
      where: { id: company.id },
      include: { facilities: true }
    })
  }

  // Si por alguna razón falla el fetch, evitamos el crash
  if (!company) return <div>Error loading company data.</div>

  // 3. Cálculos derivados
  const facilities = company.facilities || []
  const stats = calculateCompanyStats(company)

  // Calculamos la capacidad total de programadores basada en las oficinas alquiladas
  const officeFacilities = facilities.filter(f => f.type === "OFFICE")
  const totalProgrammersCapacity = officeFacilities.reduce((total, office) => {
    return total + (office.level * BUILDINGS.OFFICE.capacityPerLevel)
  }, 0)

  //claculamos la capacidad total de analistas basada en los datacenters alquilados
  const datacenterFacilities = facilities.filter(f => f.type === "DATACENTER")
  const totalAnalystsCapacity = datacenterFacilities.reduce((total, datacenter) => {
    return total + (datacenter.level * BUILDINGS.DATACENTER.capacityPerLevel)
  }, 0)

  // Calculamos la capacidad total de saboteadores basada en los basements alquilados
  const basementFacilities = facilities.filter(f => f.type === "BASEMENT")
  const totalSaboteursCapacity = basementFacilities.reduce((total, basement) => {
    return total + (basement.level * BUILDINGS.BASEMENT.capacityPerLevel)
  }, 0)

  const capacities = {
    OFFICE: facilities.filter(f => f.type === "OFFICE").reduce((total, office) => total + (office.level * BUILDINGS.OFFICE.capacityPerLevel), 0),
    DATACENTER: facilities.filter(f => f.type === "DATACENTER").reduce((total, datacenter) => total + (datacenter.level * BUILDINGS.DATACENTER.capacityPerLevel), 0),
    BASEMENT: facilities.filter(f => f.type === "BASEMENT").reduce((total, basement) => total + (basement.level * BUILDINGS.BASEMENT.capacityPerLevel), 0),
  }

  const employees = {
    PROGRAMMER: company.programmers,
    ANALYST: company.analysts,
    SABOTEUR: company.saboteurs
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans">
      <TopBar 
        companyName={company.companyName} 
        ceoName={company.ceoName}
        initialLiquidCash={company.liquidCash}
        netFlowPerHour={stats.netFlowPerHour}
      />

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-4">
        <header className="mb-8">
          <h2 className="text-3xl font-light text-white">Financial Summary</h2>
          <p className="text-neutral-500">Markets never sleep.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Gross Revenue Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Gross Generation</h3>
            <p className="text-3xl font-bold text-blue-400">
              +${stats.revenuePerHour.toLocaleString('en-US')} <span className="text-sm font-normal text-neutral-500">/ hr</span>
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Operating Expenses</h3>
            <p className="text-3xl font-bold text-red-400">
              -${stats.expensesPerHour.toLocaleString('en-US')} <span className="text-sm font-normal text-neutral-500">/ hr</span>
            </p>
          </div>
        </div>

        <Inventory 
          facilities={company.facilities}
          employees={{
            programmers: employees.PROGRAMMER,
            totalProgrammersCapacity: totalProgrammersCapacity,
            analysts: employees.ANALYST,
            totalAnalystsCapacity: totalAnalystsCapacity,
            saboteurs: employees.SABOTEUR,
            totalSaboteursCapacity: totalSaboteursCapacity,
          }} 
        />

        <DashboardControls 
        liquidCash={company.liquidCash}
        employees={employees}
        capacities={capacities}
        />
      </main>

      { ShowSettings && (
        <SettingsModal
          currentCompany={ company.companyName }
          currentCeo={ company.ceoName }
          isOpen={true}
        />
      )}
    </div>
  )
}