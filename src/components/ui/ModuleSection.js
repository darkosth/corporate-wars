export default function ModuleSection({ buildingData }) {
  const facilityName = buildingData?.[`${buildingData.type}_CONF`]?.name

  return (
    <div className="space-y-4 pt-4">
      <h3 className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
        <span>🔌</span> Módulos y Equipamiento Adicional
      </h3>
      <div className="group flex h-32 cursor-not-allowed flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700/50 bg-neutral-900/30">
        <span className="mb-2 text-2xl opacity-50 transition-opacity group-hover:opacity-100">🛒</span>
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Mercado de accesorios bloqueado
        </p>
        <p className="mt-1 text-[10px] text-neutral-700">
          {facilityName ? `${facilityName}: Próximamente disponible.` : 'Próximamente disponible.'}
        </p>
      </div>
    </div>
  )
}
