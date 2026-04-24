// src/components/Inventory.js

const StaffProgressBar = ({ employeeSnap }) => {
  const { count } = employeeSnap;
  const { capacityLimit, isFull } = employeeSnap[`${employeeSnap.role}_SNAP`];
  
  const percentage = Math.min(100, (count / (capacityLimit || 1)) * 100);

  return (
    <>
      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {isFull && (
        <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter text-right animate-pulse">
          Capacidad máxima alcanzada
        </p>
      )}
    </>
  );
};

export default function Inventory({ infrastructure, staff }) {
  const { HQ, OFFICE, DATACENTER, BASEMENT, slots } = infrastructure;
  const { PROGRAMMER, ANALYST, SABOTEUR } = staff;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* SECCIÓN: INFRAESTRUCTURA */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Infraestructura</h2>
        
        {/* Contenedor Principal de Edificios */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
          
          {/* EL PADRE: HQ */}
          <div className="p-5 flex justify-between items-center bg-gradient-to-r from-neutral-800/40 to-transparent border-b border-neutral-800 relative z-10">
            <div>
              <p className="text-white font-bold text-lg">{HQ.HQ_CONF.name}</p>
              <p className="text-xs text-neutral-400 mt-1">
                Habilita <span className="text-emerald-400 font-bold">{slots.total}</span> edificios en total
              </p>
            </div>
            <span className="text-3xl font-black text-white">x{HQ.count}</span>
          </div>

          {/* LOS HIJOS: Sub-edificios tabulados */}
          <div className="p-5 pt-4 bg-neutral-950/30">
            {/* La línea conectora vertical */}
            <div className="ml-2 pl-6 border-l-2 border-neutral-800 flex flex-col gap-3 relative">
              
              {/* OFFICE */}
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-lg p-3 flex justify-between items-center relative group hover:border-neutral-700 transition-colors">
                {/* Conector horizontal opcional para más detalle tipo árbol */}
                <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-neutral-800 group-hover:bg-neutral-700 transition-colors"></div>
                <div>
                  <p className="text-neutral-200 font-medium text-sm">{OFFICE.OFFICE_CONF.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{slots.occupied} / {slots.total} parcelas HQ</p>
                </div>
                <span className="text-lg font-bold text-neutral-400">x{OFFICE.count}</span>
              </div>

              {/* DATACENTER */}
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-lg p-3 flex justify-between items-center relative group hover:border-neutral-700 transition-colors">
                <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-neutral-800 group-hover:bg-neutral-700 transition-colors"></div>
                <div>
                  <p className="text-neutral-200 font-medium text-sm">{DATACENTER.DATACENTER_CONF.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{slots.occupied} / {slots.total} parcelas HQ</p>
                </div>
                <span className="text-lg font-bold text-neutral-400">x{DATACENTER.count}</span>
              </div>

              {/* BASEMENT */}
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-lg p-3 flex justify-between items-center relative group hover:border-neutral-700 transition-colors">
                <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-neutral-800 group-hover:bg-neutral-700 transition-colors"></div>
                <div>
                  <p className="text-neutral-200 font-medium text-sm">{BASEMENT.BASEMENT_CONF.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{slots.occupied} / {slots.total} parcelas HQ</p>
                </div>
                <span className="text-lg font-bold text-neutral-400">x{BASEMENT.count}</span>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* SECCIÓN: RECURSOS HUMANOS (Se mantiene igual) */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Recursos Humanos</h2>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-white font-medium">{PROGRAMMER.PROGRAMMER_CONF.name}</p>
              <p className="text-xs text-neutral-500 italic">{PROGRAMMER.PROGRAMMER_CONF.description}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{PROGRAMMER.count}</span>
              <span className="text-neutral-600 text-lg"> / {PROGRAMMER.PROGRAMMER_SNAP.capacityLimit}</span>
            </div>
          </div>
          <StaffProgressBar employeeSnap={PROGRAMMER} />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-white font-medium">{ANALYST.ANALYST_CONF.name}</p>
              <p className="text-xs text-neutral-500 italic">{ANALYST.ANALYST_CONF.description}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{ANALYST.count}</span>
              <span className="text-neutral-600 text-lg"> / {ANALYST.ANALYST_SNAP.capacityLimit}</span>
            </div>
          </div>
          <StaffProgressBar employeeSnap={ANALYST} />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-white font-medium">{SABOTEUR.SABOTEUR_CONF.name}</p>
              <p className="text-xs text-neutral-500 italic">{SABOTEUR.SABOTEUR_CONF.description}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{SABOTEUR.count}</span>
              <span className="text-neutral-600 text-lg"> / {SABOTEUR.SABOTEUR_SNAP.capacityLimit}</span>
            </div>
          </div>
          <StaffProgressBar employeeSnap={SABOTEUR} />
        </div>

      </div>
    </div>
  )
}