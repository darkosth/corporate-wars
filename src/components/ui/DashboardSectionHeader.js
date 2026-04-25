export default function DashboardSectionHeader({ title, description, level, slots }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-neutral-800 pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-light text-white">{title}</h2>
          {typeof level === 'number' && (
            <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 shadow-inner">
              Nivel {level}
            </span>
          )}
        </div>
        <p className="mt-1 text-neutral-500">{description}</p>
      </div>

      <div className="shrink-0 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 font-mono text-xs text-neutral-400 shadow-inner">
        Parcelas usadas:{' '}
        <span className={slots.isFull ? 'font-bold text-red-400' : 'text-white'}>
          {slots.occupied} / {slots.total}
        </span>
      </div>
    </header>
  )
}
