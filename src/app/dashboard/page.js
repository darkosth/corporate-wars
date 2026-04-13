import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import { BUILDINGS, OFFICES_PER_HQ } from '../../game/constants'
import prisma from '../../utils/prisma'
import TopBar from '../../components/TopBar'
import Inventory from '../../components/Inventory'
import DashboardControls from '../../components/DashboardControls'
import SettingsModal from '@/components/SettingsModal'
import { syncCompanyEconomy, calculateCompanyStats } from '../../utils/economy'
import { sanitizeCompany, sanitizeNumber } from '../../utils/company'

function getLevelData(type, level) {
  return BUILDINGS[type]?.levels?.[level] || BUILDINGS[type]?.levels?.[1]
}

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
    where: { ownerId: user.id }
  })

  // 2. Lógica de creación o sincronización
  if (!company) {
    company = await prisma.company.create({
      data: {
        ownerId: user.id,
        companyName: `Corp-${user.id.substring(0, 6).toUpperCase()}`,
        ceoName: "CEO Principal",
        liquidCash: 100000.0,
      }
    })
  } else {
    // Sincronizamos la economía (intereses, ingresos pasivos, etc.)
    await syncCompanyEconomy(user.id)
    
    // Refrescamos los datos después de la sincronización para tener valores actuales
    company = await prisma.company.findUnique({
      where: { id: company.id }
    })
  }
  // Si por alguna razón falla el fetch, evitamos el crash
  if (!company) return <div>Error loading company data.</div>

  company = sanitizeCompany(company)

  // 3. Cálculos derivados
  const stats = calculateCompanyStats(company)
  const hqLevelData = getLevelData('HQ', company.hqLevel)
  const officeLevelData = getLevelData('OFFICE', company.officeLevel)
  const datacenterLevelData = getLevelData('DATACENTER', company.datacenterLevel)
  const basementLevelData = getLevelData('BASEMENT', company.basementLevel)

  // Calculamos la capacidad total de programadores basada en las oficinas alquiladas
  const hqFacilities = sanitizeNumber(company.hqCount, 0, { min: 0 });
  const officeFacilities = sanitizeNumber(company.officeCount, 0, { min: 0 });
  const totalProgrammersCapacity = officeFacilities * sanitizeNumber(officeLevelData?.capacity, 0, { min: 0 });
  const totalOfficeSlotsUnlocked = hqFacilities * OFFICES_PER_HQ

  //claculamos la capacidad total de analistas basada en los datacenters alquilados
  const datacenterFacilities = sanitizeNumber(company.datacenterCount, 0, { min: 0 });
  const totalAnalystsCapacity = datacenterFacilities * sanitizeNumber(datacenterLevelData?.capacity, 0, { min: 0 });

  // Calculamos la capacidad total de saboteadores basada en los basements alquilados
  const basementFacilities = sanitizeNumber(company.basementCount, 0, { min: 0 });
  const totalSaboteursCapacity = basementFacilities * sanitizeNumber(basementLevelData?.capacity, 0, { min: 0 });

  const counts = {
    HQ: company.hqCount,
    OFFICE: company.officeCount,
    DATACENTER: company.datacenterCount,
    BASEMENT: company.basementCount,
  }

  const capacities = {
    HQ: counts.HQ * sanitizeNumber(hqLevelData?.capacity, 0, { min: 0 }),
    OFFICE: counts.OFFICE * sanitizeNumber(officeLevelData?.capacity, 0, { min: 0 }),
    DATACENTER: counts.DATACENTER * sanitizeNumber(datacenterLevelData?.capacity, 0, { min: 0 }),
    BASEMENT: counts.BASEMENT * sanitizeNumber(basementLevelData?.capacity, 0, { min: 0 }),
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
        stats={stats}
      />

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-4">
        <header className="mb-8">
          <h2 className="text-3xl font-light text-white">Financial Summary</h2>
          <p className="text-neutral-500">Markets never sleep.</p>
        </header>

        <Inventory 
          facilities={{
            HQ: hqFacilities,
            OFFICE: officeFacilities,
            DATACENTER: datacenterFacilities,
            BASEMENT: basementFacilities
          }}
          employees={{
            programmers: employees.PROGRAMMER,
            totalProgrammersCapacity: totalProgrammersCapacity,
            analysts: employees.ANALYST,
            totalAnalystsCapacity: totalAnalystsCapacity,
            saboteurs: employees.SABOTEUR,
            totalSaboteursCapacity: totalSaboteursCapacity,
            totalOfficeSlotsUnlocked,
          }}
        />

        <DashboardControls 
        liquidCash={company.liquidCash}
        facilities={counts}
        employees={employees}
        capacities={capacities}
        officeSlotsUnlocked={totalOfficeSlotsUnlocked}
        levels={{
          HQ: company.hqLevel || 1,
          OFFICE: company.officeLevel || 1, 
          DATACENTER: company.datacenterLevel || 1,
          BASEMENT: company.basementLevel || 1,
        }}
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
