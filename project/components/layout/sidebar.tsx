'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import {
  User,
  LogOut,
  Calendar,
  Settings,
  Home,
  Building2,
  Users,
  Plus,
  ClipboardList,
  FileText,
  Shield,
  CheckCircle2,
  XCircle,
  Stethoscope,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Sidebar() {
  const { user, profile, signOut, isStaff, isAdmin } = useAuth()
  const pathname = usePathname()

  console.log('🔍 Sidebar - User:', user?.email, 'Profile:', profile?.role, 'isStaff:', isStaff, 'isAdmin:', isAdmin)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">Salon d'honneur</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/') && pathname === '/'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Tableau de bord</span>
        </Link>

        {isAdmin && (
          <>
            <Link
              href="/admin/pending-requests"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/pending-requests')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Demandes en attente</span>
            </Link>
            <Link
              href="/admin/approved-requests"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/approved-requests')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Demandes acceptées</span>
            </Link>
            <Link
              href="/admin/rejected-requests"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/rejected-requests')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <XCircle className="h-5 w-5" />
              <span>Demandes rejetées</span>
            </Link>
            <Link
              href="/admin/diagnostic"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/diagnostic')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Diagnostic JWT</span>
            </Link>
            <Link
              href="/admin/lounges"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/lounges')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span>Gestion des salons</span>
            </Link>
            <Link
              href="/admin/lounges/new"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/lounges/new')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un salon</span>
            </Link>
          </>
        )}

        {user && (
          <>
            <Link
              href="/access-request"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/access-request')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Demande d'accès</span>
            </Link>
            <Link
              href="/my-requests"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/my-requests')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Mes demandes d'accès</span>
            </Link>
            <Link
              href="/diagnostic"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/diagnostic')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Stethoscope className="h-5 w-5" />
              <span>Diagnostic compte</span>
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin') && pathname === '/admin'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Tableau de Bord Admin</span>
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/users')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Utilisateurs et rôles</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="h-5 w-5" />
                <span className="truncate">{profile?.full_name || user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {profile?.full_name || user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-requests">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Mes demandes d'accès
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
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
          <div className="space-y-2">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register">S'inscrire</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
