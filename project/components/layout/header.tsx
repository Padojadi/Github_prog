'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Calendar, Settings } from 'lucide-react'

export function Header() {
  const { user, profile, signOut, isStaff } = useAuth()

  return (
    <header className="border-b bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">Salon d'honneur</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/lounges" className="text-sm font-medium hover:text-primary">
            Parcourir les salons
          </Link>
          {user && (
            <Link href="/bookings" className="text-sm font-medium hover:text-primary">
              Mes Réservations
            </Link>
          )}
          {isStaff && (
            <Link href="/admin" className="text-sm font-medium hover:text-primary">
              Tableau de Bord Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.full_name || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bookings">
                    <Calendar className="mr-2 h-4 w-4" />
                    Mes Réservations
                  </Link>
                </DropdownMenuItem>
                {isStaff && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Tableau de Bord Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link href="/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
