'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.error('Login error:', error)
        toast.error(error.message || 'Erreur de connexion')
        setLoading(false)
        return
      }

      if (!authData?.session) {
        toast.error('Aucune session créée')
        setLoading(false)
        return
      }

      console.log('✅ Login successful, session created:', authData.session.user.email)

      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: { session: verifySession } } = await supabase.auth.getSession()
      console.log('🔍 Session verification:', verifySession?.user?.email)

      if (!verifySession) {
        toast.error('Erreur de persistance de la session')
        setLoading(false)
        return
      }

      toast.success('Connexion réussie')
      window.location.href = '/'
    } catch (err) {
      console.error('Login exception:', err)
      toast.error('Erreur lors de la connexion: ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  )
}
