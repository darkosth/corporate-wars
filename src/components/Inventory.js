import { BUILDINGS, OFFICES_PER_HQ } from '../game/constants'
import { sanitizeNumber } from '../utils/company'

export default function Inventory({ employees, facilities }) {
  const totalHqs = sanitizeNumber(facilities?.HQ, 0, { min: 0 })
  const totalOffices = sanitizeNumber(facilities?.OFFICE, 0, { min: 0 })
  const totalDatacenters = sanitizeNumber(facilities?.DATACENTER, 0, { min: 0 })
  const totalBasements = sanitizeNumber(facilities?.BASEMENT, 0, { min: 0 })
  const safeEmployees = {
    programmers: sanitizeNumber(employees?.programmers, 0, { min: 0 }),
    totalProgrammersCapacity: sanitizeNumber(employees?.totalProgrammersCapacity, 0, { min: 0 }),
    analysts: sanitizeNumber(employees?.analysts, 0, { min: 0 }),
    totalAnalystsCapacity: sanitizeNumber(employees?.totalAnalystsCapacity, 0, { min: 0 }),
    saboteurs: sanitizeNumber(employees?.saboteurs, 0, { min: 0 }),
    totalSaboteursCapacity: sanitizeNumber(employees?.totalSaboteursCapacity, 0, { min: 0 }),
    totalOfficeSlotsUnlocked: sanitizeNumber(employees?.totalOfficeSlotsUnlocked, 0, { min: 0 })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Infraestructura</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{BUILDINGS.HQ.name}</p>
              <p className="text-xs text-neutral-500">Cada HQ habilita {OFFICES_PER_HQ} offices</p>
            </div>
            <span className="text-xl font-bold text-white">x{totalHqs}</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{BUILDINGS.OFFICE.name}</p>
              <p className="text-xs text-neutral-500">{totalOffices} / {safeEmployees.totalOfficeSlotsUnlocked} habilitados por HQ</p>
            </div>
            <span className="text-xl font-bold text-white">x{totalOffices}</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{BUILDINGS.DATACENTER.name}</p>
              <p className="text-xs text-neutral-500">Numero de edificios obtenidos</p>
            </div>
            <span className="text-xl font-bold text-white">x{totalDatacenters}</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{BUILDINGS.BASEMENT.name}</p>
              <p className="text-xs text-neutral-500">Numero de edificios obtenidos</p>
            </div>
            <span className="text-xl font-bold text-white">x{totalBasements}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Recursos Humanos</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-white font-medium">Programadores</p>
              <p className="text-xs text-neutral-500 italic">Generando software de alta frecuencia</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{safeEmployees.programmers}</span>
              <span className="text-neutral-600 text-lg"> / {safeEmployees.totalProgrammersCapacity}</span>
            </div>
          </div>

          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${safeEmployees.programmers >= safeEmployees.totalProgrammersCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (safeEmployees.programmers / (safeEmployees.totalProgrammersCapacity || 1)) * 100)}%` }}
            ></div>
          </div>
          {safeEmployees.programmers >= safeEmployees.totalProgrammersCapacity && (
            <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter text-right animate-pulse">
              Capacidad máxima alcanzada
            </p>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-white font-medium">Analistas</p>
              <p className="text-xs text-neutral-500 italic">desarollando software para mas eficiencia de Operaciones</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{safeEmployees.analysts}</span>
              <span className="text-neutral-600 text-lg"> / {safeEmployees.totalAnalystsCapacity}</span>
            </div>
          </div>

          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${safeEmployees.analysts >= safeEmployees.totalAnalystsCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (safeEmployees.analysts / (safeEmployees.totalAnalystsCapacity || 1)) * 100)}%` }}
            ></div>
          </div>
          {safeEmployees.analysts >= safeEmployees.totalAnalystsCapacity && (
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
              <span className="text-2xl font-black text-blue-400">{safeEmployees.saboteurs}</span>
              <span className="text-neutral-600 text-lg"> / {safeEmployees.totalSaboteursCapacity}</span>
            </div>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${safeEmployees.saboteurs >= safeEmployees.totalSaboteursCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (safeEmployees.saboteurs / (safeEmployees.totalSaboteursCapacity || 1)) * 100)}%` }}
            ></div>
          </div>
          {safeEmployees.saboteurs >= safeEmployees.totalSaboteursCapacity && (
            <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter text-right animate-pulse">
              Capacidad máxima alcanzada
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
