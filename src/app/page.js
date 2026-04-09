// src/app/page.js
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
      
      <div className="max-w-3xl space-y-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
          CORPORATE WARS
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-400 font-light">
          El mercado no perdona. Expande tu corporación, contrata ejércitos privados, 
          saquea a la competencia y domina la liga. 
        </p>

        <div className="pt-8">
          <Link 
            href="/login" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-transform hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            Entrar al Mercado
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-neutral-600 text-sm">
        Producto Mínimo Viable - Fase 1
      </footer>
    </main>
  )
}