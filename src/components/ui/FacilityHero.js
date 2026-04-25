import LoadingSpinner from './LoadingSpinner'

const formatMoney = (value) => (value || 0).toLocaleString('en-US')

export default function FacilityHero({
  buildingData,
  staffData,
  departmentMetrics,
  capacityLabel,
  capacityValue,
  isLoading,
  canUpgrade,
  upgradeCost,
  onUpgrade
}) {
  if (!buildingData) return null

  const buildingConf = buildingData[`${buildingData.type}_CONF`]

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
      <div className="pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 transform p-8 text-9xl opacity-5">
        {buildingConf.emoji}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="w-full flex-1">
          <h3 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Generación Bruta: ${formatMoney(departmentMetrics.gross)}/h
          </h3>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-5xl font-black font-mono drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] ${
                departmentMetrics.isNetPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {departmentMetrics.isNetPositive ? '+' : '-'}${formatMoney(Math.abs(departmentMetrics.net))}
            </span>
            <span
              className={`text-xl font-bold ${
                departmentMetrics.isNetPositive ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              /h
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Flujo neto basado en {buildingData.count} instalación(es) operativas.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 border-y border-neutral-800 py-4 lg:w-auto lg:flex-row lg:border-x lg:border-y-0 lg:px-6 lg:py-0">
          <div className="min-w-[140px] space-y-2">
            <span className="block border-b border-neutral-800 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Desglose Operativo
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Instalación:</span>
              <span className="font-mono text-red-400/80">
                -${formatMoney(departmentMetrics.facilityExpense)}/h
              </span>
            </div>
            {staffData && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Nómina:</span>
                <span className="font-mono text-red-400/80">
                  -${formatMoney(departmentMetrics.staffExpense)}/h
                </span>
              </div>
            )}
          </div>

          <div className="min-w-[140px] space-y-2">
            <span className="block border-b border-neutral-800 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Estado General
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">{capacityLabel}:</span>
              <span className="font-mono text-blue-400">{capacityValue}</span>
            </div>
            {staffData && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Prod. Personal:</span>
                <span className="font-mono text-emerald-400/80">
                  +${formatMoney(departmentMetrics.staffRevenue)}/h
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col items-center lg:w-auto lg:items-end">
          {buildingConf.isMaxLevel ? (
            <>
              <button
                disabled={true}
                className="w-full cursor-not-allowed rounded-xl border border-neutral-700 bg-neutral-800 px-8 py-4 text-sm font-black uppercase tracking-widest text-neutral-500 lg:w-auto"
              >
                Nivel Máximo
              </button>
              <span className="mt-2 block font-mono text-[10px] text-emerald-500">
                Tecnología tope alcanzada
              </span>
            </>
          ) : (
            <>
              <button
                onClick={onUpgrade}
                disabled={isLoading || !canUpgrade}
                className="relative w-full rounded-xl border border-blue-400 bg-gradient-to-t from-blue-700 to-blue-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95 disabled:grayscale disabled:opacity-50 hover:from-blue-600 hover:to-blue-400 lg:w-auto"
              >
                <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                  Subir a Nivel {buildingData.level + 1}
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
              </button>
              <span className="mt-2 block font-mono text-[10px] text-neutral-400">
                Costo de mejora:{' '}
                <strong className={canUpgrade ? 'text-white' : 'text-red-400'}>
                  ${formatMoney(upgradeCost)}
                </strong>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
