import { BUILDINGS } from '../game/constants'

export default function Inventory({ facilities, employees }) {
  // Agrupamos edificios por tipo para contarlos
  const countByType = (type) => facilities.filter(f => f.type === type).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Columna: Infraestructura */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Infraestructura</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
          
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{BUILDINGS.OFFICE.name}</p>
              <p className="text-xs text-neutral-500">Numero de edificios obtenidos</p>
            </div>
            <span className="text-xl font-bold text-white">x{countByType("OFFICE")}</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{BUILDINGS.DATACENTER.name}</p>
              <p className="text-xs text-neutral-500">Numero de edificios obtenidos</p>
            </div>
            <span className="text-xl font-bold text-white">x{countByType("DATACENTER")}</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
                <p className="text-white font-medium">{BUILDINGS.BASEMENT.name}</p>
                <p className="text-xs text-neutral-500">Numero de edificios obtenidos</p>
            </div>
            <span className="text-xl font-bold text-white">x{countByType("BASEMENT")}</span>
          </div>

        </div>
      </div>

      {/* Columna: Capital Humano */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Recursos Humanos</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-white font-medium">Programadores</p>
                  <p className="text-xs text-neutral-500 italic">Generando software de alta frecuencia</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-400">{employees.programmers}</span>
                  <span className="text-neutral-600 text-lg"> / {employees.totalProgrammersCapacity}</span>
                </div>
            </div>
          
          {/* Barra de capacidad visual */}
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${employees.programmers >= employees.totalProgrammersCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (employees.programmers / (employees.totalProgrammersCapacity || 1)) * 100)}%` }}
            ></div>
          </div>
          {employees.programmers >= employees.totalProgrammersCapacity && (
            <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter text-right animate-pulse">
              Capacidad máxima alcanzada
            </p>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-white font-medium">Analistas</p>
                    <p className="text-xs text-neutral-500 italic"> desarollando software para mas eficiencia de Operaciones </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-blue-400">{employees.analysts}</span>
                    <span className="text-neutral-600 text-lg"> / {employees.totalAnalystsCapacity}</span>
                </div>
            </div>

            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${employees.analysts >= employees.totalAnalystsCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (employees.analysts / (employees.totalAnalystsCapacity || 1)) * 100)}%` }}
                ></div>
            </div>
            {employees.analysts >= employees.totalAnalystsCapacity && (
                <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter text-right animate-pulse">
                    Capacidad máxima alcanzada
                </p>
            )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-white font-medium">Saboteadores</p>
                    <p className="text-xs text-neutral-500 italic">Infiltrándose en las instalaciones enemigas</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-blue-400">{employees.saboteurs}</span>
                    <span className="text-neutral-600 text-lg"> / {employees.totalSaboteursCapacity}</span>
                </div>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${employees.saboteurs >= employees.totalSaboteursCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (employees.saboteurs / (employees.totalSaboteursCapacity || 1)) * 100)}%` }}
                ></div>
            </div>
            {employees.saboteurs >= employees.totalSaboteursCapacity && (
                <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter text-right animate-pulse">
                    Capacidad máxima alcanzada
                </p>
            )}

        </div>

      </div>

    </div>
  )
}