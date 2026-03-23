'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (!mounted) return

        console.log('🔍 Profile loaded:', data, 'Error:', error)
        if (data) {
          console.log('🔍 Profile role:', (data as Profile).role)
        }
        setProfile(data as Profile | null)
      } catch (error) {
        console.error('🔴 Error loading profile:', error)
        if (mounted) setProfile(null)
      }
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        console.log('🔍 Initial session check:', session?.user?.email)

        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          console.log('🔍 No active session found')
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('🔴 Error in initAuth:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 Auth state changed:', event, session?.user?.email)

      if (!mounted) return

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'administrator',
    isStaff: profile?.role === 'administrator' || profile?.role === 'lounge_manager' || profile?.role === 'protocol_officer',
    isGuest: profile?.role === 'applicant',
  }
}
