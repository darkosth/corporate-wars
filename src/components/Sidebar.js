import Link from 'next/link'

export default function Sidebar({ currentTab }) {
  const tabs = [
    { id: 'overview', name: 'Dashboard', emoji: '📊' },
    { id: 'hq', name: 'Headquarters', emoji: '🏛️' },
    { id: 'office', name: 'Operaciones', emoji: '🏢' },
    { id: 'datacenter', name: 'Investigación', emoji: '🗄️' },
    { id: 'basement', name: 'Encubierto', emoji: '☢️' }
  ]

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col hidden md:flex">
      <div className="p-4 flex-1 space-y-2 mt-4">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id
          return (
            <Link key={tab.id} href={`?tab=${tab.id}`}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-neutral-800 border border-neutral-700 text-white shadow-sm' 
                  : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300'
              }`}>
                <span className={`text-xl transition-all ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>
                  {tab.emoji}
                </span>
                <span className="font-bold text-sm tracking-wide">{tab.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* Detalle inmersivo del lore */}
      <div className="p-4 border-t border-neutral-800 text-xs text-neutral-600 font-mono text-center bg-neutral-950/50">
        Corporate OS v0.1.4 <br/>
        <span className="text-emerald-900 animate-pulse">Conexión Segura</span>
      </div>
    </aside>
  )
}