'use client'
import { useState } from 'react'
import { buyFacility, hireStaff, upgradeFacility, sellFacility, fireStaff } from '../app/dashboard/actions'
import ActionCard from './ui/ActionCard'
import StaffActionCard from './ui/StaffActionCard'

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export default function DashboardControls({ currentTab, player, infrastructure, staff }) {
  const [error, setError] = useState(null)
  const [loadingState, setLoadingState] = useState(false)

  const executeAction = async (actionPromise) => {
    setLoadingState(true)
    const result = await actionPromise
    if (result?.error) setError(result.error)
    else setError(null)
    setLoadingState(false)
  }

  // 1. EL "ENRUTADOR" INTERNO
  let title = "";
  let desc = "";
  let buildingData = null;
  let staffData = null;

  switch(currentTab) {
    case 'hq':
      title = "Headquarters"; 
      desc = "Gestión de terrenos, zonificación y construcción de infraestructura.";
      buildingData = infrastructure.HQ;
      break;
    case 'office':
      title = "Operaciones"; 
      desc = "Centro de desarrollo de software de alta frecuencia.";
      buildingData = infrastructure.OFFICE; 
      staffData = staff.PROGRAMMER;
      break;
    case 'datacenter':
      title = "Centro de Investigación"; 
      desc = "Procesamiento de datos y analítica avanzada.";
      buildingData = infrastructure.DATACENTER; 
      staffData = staff.ANALYST;
      break;
    case 'basement':
      title = "Operaciones Encubiertas"; 
      desc = "Instalaciones no registradas. Máxima seguridad.";
      buildingData = infrastructure.BASEMENT; 
      staffData = staff.SABOTEUR;
      break;
  }

  const checkAfford = (price) => player.liquidCash >= price
  const slots = infrastructure.slots;
  const buildingTypes = ['HQ', 'OFFICE', 'DATACENTER', 'BASEMENT'];

  const formatMoney = (val) => (val || 0).toLocaleString('en-US');

  const isHQ = buildingData?.type === 'HQ';
  const capacityLabel = isHQ ? 'Capacidad de Parcelas' : 'Ocupación de Personal';
  const capacityValue = isHQ 
    ? `${buildingData[`${buildingData.type}_SNAP`].totalCapacity} edificios` 
    : `${staffData?.count || 0} / ${buildingData[`${buildingData.type}_SNAP`].totalCapacity} empleados`;

  // Cálculos Financieros Estrictos del Departamento
  const deptGross = (buildingData ? buildingData[`${buildingData.type}_SNAP`].totalRevenue : 0) + 
                    (staffData ? staffData[`${staffData.role}_SNAP`].totalRevenue : 0);
                    
  const deptExpenses = (buildingData ? buildingData[`${buildingData.type}_SNAP`].totalMaintenance : 0) + 
                       (staffData ? staffData[`${staffData.role}_SNAP`].totalSalary : 0);
                       
  const deptNet = deptGross - deptExpenses;
  const isNetPositive = deptNet >= 0;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      
      {/* CABECERA GLOBAL */}
      <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-light text-white">{title}</h2>
            {buildingData && (
              <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-inner">
                Nivel {buildingData.level}
              </span>
            )}
          </div>
          <p className="text-neutral-500 mt-1">{desc}</p>
        </div>
        
        <div className="text-xs font-mono bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-neutral-400 shadow-inner shrink-0">
          Parcelas usadas: <span className={slots.isFull ? "text-red-400 font-bold" : "text-white"}>{slots.occupied} / {slots.total}</span>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-400 rounded-lg flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-10">
        
        {/* SECCIÓN 1: HERO STATS & UPGRADE */}
        {buildingData && (
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl pointer-events-none transform translate-x-1/4 -translate-y-1/4">
              {buildingData[`${buildingData.type}_CONF`].emoji}
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
              
              {/* Bloque Izquierdo: Flujo Neto (El Rey) */}
              <div className="flex-1 w-full">
                {/* Generación Bruta relegada a subtítulo */}
                <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  Generación Bruta: ${formatMoney(deptGross)}/h
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-black font-mono drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] ${isNetPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isNetPositive ? '+' : '-'}${formatMoney(Math.abs(deptNet))}
                  </span>
                  <span className={`text-xl font-bold ${isNetPositive ? 'text-emerald-600' : 'text-red-600'}`}>/h</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Flujo neto basado en {buildingData.count} instalación(es) operativas.
                </p>
              </div>

              {/* Bloque Central: Desglose Detallado */}
              <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-auto border-y lg:border-y-0 lg:border-x border-neutral-800 py-4 lg:py-0 lg:px-6">
                
                <div className="space-y-2 min-w-[140px]">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-1 block">Desglose Operativo</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Instalación:</span>
                    <span className="font-mono text-red-400/80">-${formatMoney(buildingData[`${buildingData.type}_SNAP`].totalMaintenance)}/h</span>
                  </div>
                  {staffData && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500">Nómina:</span>
                      <span className="font-mono text-red-400/80">-${formatMoney(staffData[`${staffData.role}_SNAP`].totalSalary)}/h</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 min-w-[140px]">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-1 block">Estado General</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">{capacityLabel}:  </span>
                    <span className="font-mono text-blue-400">{capacityValue}</span>
                  </div>
                  {staffData && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500">Prod. Personal:</span>
                      <span className="font-mono text-emerald-400/80">+${formatMoney(staffData[`${staffData.role}_SNAP`].totalRevenue)}/h</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Bloque Derecho: Upgrade */}
              <div className="w-full lg:w-auto flex flex-col items-center lg:items-end">
                {buildingData[`${buildingData.type}_CONF`].isMaxLevel ? (
                  <>
                    <button 
                      disabled={true} 
                      className="w-full lg:w-auto bg-neutral-800 border border-neutral-700 text-neutral-500 px-8 py-4 rounded-xl font-black text-sm tracking-widest uppercase cursor-not-allowed"
                    >
                      👑 Nivel Máximo
                    </button>
                    <span className="text-[10px] font-mono text-emerald-500 mt-2 block">
                      Tecnología tope alcanzada
                    </span>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => executeAction(upgradeFacility(buildingData.type))}
                      disabled={loadingState || !checkAfford(buildingData[`${buildingData.type}_CONF`].nextUpgradeCost)} 
                      className="relative w-full lg:w-auto bg-gradient-to-t from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 border border-blue-400 text-white px-8 py-4 rounded-xl font-black text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                      <span className={loadingState ? 'opacity-0' : 'opacity-100'}>
                        🚀 Subir a Nivel {buildingData.level + 1}
                      </span>
                      {loadingState && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
                    </button>
                    <span className="text-[10px] font-mono text-neutral-400 mt-2 block">
                      Costo de mejora: <strong className={checkAfford(buildingData[`${buildingData.type}_CONF`].nextUpgradeCost) ? "text-white" : "text-red-400"}>
                        ${formatMoney(buildingData[`${buildingData.type}_CONF`].nextUpgradeCost)}
                      </strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: CONTENIDO DINÁMICO (HQ vs RRHH) */}
        {isHQ ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span>🏗️</span> Planificación Urbana Corporativa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buildingTypes.map((type) => {
                const bData = infrastructure[type];
                const typeIsHQ = type === 'HQ';
                const canAfford = checkAfford(bData[`${type}_CONF`].basePrice);
                const isBlocked = !typeIsHQ && slots.isFull;

                return (
                  <ActionCard
                    key={type}
                    title={`${bData[`${type}_CONF`].name}`}
                    subtitle={bData[`${type}_CONF`].description}
                    emoji={bData[`${type}_CONF`].emoji}
                    cost={bData[`${type}_CONF`].basePrice}
                    revenue={bData[`${type}_CONF`].baseRevenue}
                    expense={bData[`${type}_CONF`].baseMaintenance}
                    onAction={() => executeAction(buyFacility(type))}
                    onSell={() => executeAction(sellFacility(type))}
                    canSell={bData.count > (type ==='HQ' ? 1 : 0)} // Solo se puede vender si hay al menos 1 (o 2 para HQ)
                    sellPrice={Math.floor(bData[`${type}_CONF`].basePrice / 2)}
                    isLoading={loadingState}
                    isDisabled={loadingState || !canAfford || isBlocked}
                    buttonText={
                      !canAfford ? 'Fondos Insuficientes' :
                      isBlocked ? 'Sin cupo (Expande el HQ)' :
                      typeIsHQ ? 'Expandir Sede' : 'Construir Instalación'
                    }
                  />
                )
              })}
            </div>
          </div>
        ) : staffData ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span>👥</span> Recursos Humanos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaffActionCard
                title={staffData[`${staffData.role}_CONF`].name}
                subtitle={staffData[`${staffData.role}_CONF`].description}
                emoji={staffData[`${staffData.role}_CONF`].emoji}
                cost={staffData[`${staffData.role}_CONF`].costToHire}
                revenue={staffData[`${staffData.role}_CONF`].revenue}
                expense={staffData[`${staffData.role}_CONF`].salary}
                onAction={(qty) => executeAction(hireStaff(staffData.role, qty))}
                onSell={(qty) => executeAction(fireStaff(staffData.role, qty))}
                staffCount={staffData.count} // Para validar que no despidas fantasmas
                isLoading={loadingState}
                maxSpace={staffData[`${staffData.role}_SNAP`].capacityLimit - staffData.count}
                playerCash={player.liquidCash}
              />
            </div>
          </div>
        ) : null}

        {/* SECCIÓN 3: MÓDULOS Y ACCESORIOS */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 border-b border-neutral-800 pb-2">
            <span>🔌</span> Módulos y Equipamiento Adicional
          </h3>
          <div className="h-32 border border-dashed border-neutral-700/50 rounded-xl flex flex-col items-center justify-center bg-neutral-900/30 group cursor-not-allowed">
            <span className="text-2xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">🛒</span>
            <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest">Mercado de accesorios bloqueado</p>
            <p className="text-neutral-700 text-[10px] mt-1">Próximamente disponibles.</p>
          </div>
        </div>

      </div>
    </div>
  )
}