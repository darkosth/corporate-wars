// src/app/login/actions.js
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient() // <-- AÑADIMOS EL AWAIT
  
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=No se pudo iniciar sesión')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Redirigiremos al HQ de la empresa luego
}

export async function signup(formData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Error al crear la cuenta')
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Revisa tu correo para verificar tu cuenta')
}