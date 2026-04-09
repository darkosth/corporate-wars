// src/app/login/page.js
import { login, signup } from './actions'

export default async function LoginPage({ searchParams }) {
  // AQUÍ ESTÁ LA MAGIA: Esperamos a que la promesa se resuelva
  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Acceso Corporativo</h2>
        
        <form className="flex flex-col gap-4 text-neutral-300">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button 
              formAction={login} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Iniciar Sesión
            </button>
            <button 
              formAction={signup} 
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Registrar Nueva Empresa
            </button>
          </div>

          {/* Usamos la variable message ya desempaquetada */}
          {message && (
            <p className="mt-4 p-4 bg-neutral-800/50 text-red-400 text-center text-sm rounded">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}