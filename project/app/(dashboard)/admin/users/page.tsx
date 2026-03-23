'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, Shield, UserCheck, Building2, Lock, Settings as SettingsIcon, UserPlus, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { SyncMetadataButton } from './sync-metadata-button'

type UserRole = 'applicant' | 'protocol_officer' | 'lounge_manager' | 'security' | 'administrator'

interface Profile {
  id: string
  full_name: string | null
  email: string
  role: UserRole
  created_at: string
}

const roleLabels: Record<UserRole, string> = {
  applicant: 'Demandeur',
  protocol_officer: 'Agent de protocole',
  lounge_manager: 'Gestionnaire de salon',
  security: 'Sécurité',
  administrator: 'Administrateur',
}

const roleDescriptions: Record<UserRole, string> = {
  applicant: 'Ambassade, ministère, entreprise, représentant',
  protocol_officer: 'Vérifie la conformité des demandes',
  lounge_manager: 'Planifie la réception et les ressources',
  security: 'Contrôle d\'accès, enregistrement entrées/sorties',
  administrator: 'Supervision globale, gestion des utilisateurs, paramètres',
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  applicant: <Building2 className="h-4 w-4" />,
  protocol_officer: <UserCheck className="h-4 w-4" />,
  lounge_manager: <Users className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  administrator: <SettingsIcon className="h-4 w-4" />,
}

const roleColors: Record<UserRole, string> = {
  applicant: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  protocol_officer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  lounge_manager: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  security: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  administrator: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function UsersManagementPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'applicant' as UserRole,
  })
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{ userId: string; email: string } | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [])

  async function loadProfiles() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-all-profiles`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors du chargement des utilisateurs')
      }

      const result = await response.json()
      const profilesData = result.profiles || []

      const profilesWithEmail = profilesData.map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email || 'N/A',
        role: profile.role || 'applicant',
        created_at: profile.created_at,
      }))

      setProfiles(profilesWithEmail)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des utilisateurs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(userId: string, newRole: UserRole) {
    setUpdating(userId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-user-role`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour du rôle')
      }

      setProfiles(profiles.map(p =>
        p.id === userId ? { ...p, role: newRole } : p
      ))

      toast.success('Rôle mis à jour avec succès')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du rôle')
      console.error(error)
    } finally {
      setUpdating(null)
    }
  }

  async function createUser() {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (newUser.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setCreating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-user`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création de l\'utilisateur')
      }

      toast.success('Utilisateur créé avec succès')
      setNewUser({
        email: '',
        password: '',
        full_name: '',
        role: 'applicant',
      })
      setIsDialogOpen(false)
      loadProfiles()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de l\'utilisateur')
      console.error(error)
    } finally {
      setCreating(false)
    }
  }

  async function resetPassword() {
    if (!resetPasswordDialog || !newPassword) {
      toast.error('Veuillez entrer un nouveau mot de passe')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setResetting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/reset-user-password`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: resetPasswordDialog.userId,
          newPassword: newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la réinitialisation du mot de passe')
      }

      toast.success(`Mot de passe mis à jour pour ${resetPasswordDialog.email}`)
      setResetPasswordDialog(null)
      setNewPassword('')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation du mot de passe')
      console.error(error)
    } finally {
      setResetting(false)
    }
  }

  const roleStats = profiles.reduce((acc, profile) => {
    acc[profile.role] = (acc[profile.role] || 0) + 1
    return acc
  }, {} as Record<UserRole, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Utilisateurs et leurs rôles</h1>
          <p className="text-muted-foreground">
            Gérer les utilisateurs et attribuer des rôles selon leurs responsabilités
          </p>
        </div>
        <div className="flex gap-2">
          <SyncMetadataButton />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau compte utilisateur.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Nom complet</Label>
                <Input
                  id="full_name"
                  placeholder="Jean Dupont"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([role, label]) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          {roleIcons[role as UserRole]}
                          <div>
                            <div>{label}</div>
                            <div className="text-xs text-muted-foreground">
                              {roleDescriptions[role as UserRole]}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={creating}
              >
                Annuler
              </Button>
              <Button onClick={createUser} disabled={creating}>
                {creating ? 'Création...' : 'Créer l\'utilisateur'}
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {Object.entries(roleLabels).map(([role, label]) => (
          <Card key={role}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${roleColors[role as UserRole]}`}>
                  {roleIcons[role as UserRole]}
                </div>
                <span className="text-2xl font-bold">{roleStats[role as UserRole] || 0}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-sm mb-1">{label}</CardTitle>
              <CardDescription className="text-xs">
                {roleDescriptions[role as UserRole]}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Total: {profiles.length} utilisateur{profiles.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle actuel</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        {profile.full_name || 'Sans nom'}
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[profile.role]}>
                          <span className="mr-1">{roleIcons[profile.role]}</span>
                          {roleLabels[profile.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {roleDescriptions[profile.role]}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setResetPasswordDialog({ userId: profile.id, email: profile.email })}
                          >
                            <KeyRound className="h-4 w-4 mr-2" />
                            Réinitialiser
                          </Button>
                          <Select
                            value={profile.role}
                            onValueChange={(value) => updateUserRole(profile.id, value as UserRole)}
                            disabled={updating === profile.id}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(roleLabels).map(([role, label]) => (
                                <SelectItem key={role} value={role}>
                                  <div className="flex items-center gap-2">
                                    {roleIcons[role as UserRole]}
                                    {label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!resetPasswordDialog} onOpenChange={(open) => !open && setResetPasswordDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Définissez un nouveau mot de passe pour {resetPasswordDialog?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new_password">Nouveau mot de passe</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="Au moins 6 caractères"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                L'utilisateur pourra se connecter avec ce nouveau mot de passe
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResetPasswordDialog(null)
                setNewPassword('')
              }}
            >
              Annuler
            </Button>
            <Button onClick={resetPassword} disabled={resetting || !newPassword}>
              {resetting ? 'Réinitialisation...' : 'Réinitialiser'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
