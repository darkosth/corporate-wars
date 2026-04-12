'use client'
import { updateSettings } from '../app/dashboard/actions'
import { useRouter } from 'next/navigation'

export default function SettingsModal({ currentCompany, currentCeo, isOpen }) {
  const router = useRouter()

  if (!isOpen) return null

  const closeModal = () => {
    router.push('/dashboard')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const result = await updateSettings(formData)
    console.log('Settings update result:', result)
    if (result.success) {
      closeModal()
    } else { 
      alert(result.error) 
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Configuración de Identidad</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase">Nombre de la Empresa</label>
            <input name="companyName" defaultValue={currentCompany} className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 mt-1 text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase">Nombre del CEO</label>
            <input name="ceoName" defaultValue={currentCeo} className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 mt-1 text-white focus:border-blue-500 outline-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 bg-neutral-800 text-white p-2 rounded font-bold hover:bg-neutral-700">Cancelar</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-500">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}