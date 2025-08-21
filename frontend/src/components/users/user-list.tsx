
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Edit, Trash2, Shield } from "lucide-react"
import { UserForm } from "./user-form"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"

interface User {
  id: string
  email: string
  role: "admin" | "user"
  createdAt: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()
  const permissions = usePermissions()

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@example.com",
        role: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        email: "user1@example.com",
        role: "user",
        createdAt: "2024-01-16T14:30:00Z",
      },
      {
        id: "3",
        email: "user2@example.com",
        role: "user",
        createdAt: "2024-01-17T09:15:00Z",
      },
    ]
    setUsers(mockUsers)
    setLoading(false)
  }, [])

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreateUser = (userData: Omit<User, "id" | "createdAt">) => {
    if (!permissions.canManageUsers()) {
      alert("You don't have permission to create users")
      return
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateUser = (userData: Omit<User, "id" | "createdAt">) => {
    if (!editingUser) return

    if (!permissions.canEditUser(editingUser.id)) {
      alert("You don't have permission to edit this user")
      return
    }

    setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...userData } : user)))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    if (!permissions.canDeleteUser(userId)) {
      alert("You don't have permission to delete this user")
      return
    }

    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleEditUser = (user: User) => {
    if (!permissions.canEditUser(user.id)) {
      alert("You don't have permission to edit this user")
      return
    }
    setEditingUser(user)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!permissions.canViewUserManagement()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view user management.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        {permissions.canManageUsers() && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. They will receive login credentials via email.
                </DialogDescription>
              </DialogHeader>
              <UserForm onSubmit={handleCreateUser} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!permissions.canManageUsers() && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You have limited permissions. You can only view and edit your own profile.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.email}
                  {user.id === currentUser?.id && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {permissions.canEditUser(user.id) && (
                      <Dialog
                        open={editingUser?.id === user.id}
                        onOpenChange={(open) => {
                          if (!open) setEditingUser(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Update user information and permissions.</DialogDescription>
                          </DialogHeader>
                          <UserForm initialData={editingUser} onSubmit={handleUpdateUser} isEditing />
                        </DialogContent>
                      </Dialog>
                    )}
                    {permissions.canDeleteUser(user.id) && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {!permissions.canEditUser(user.id) && !permissions.canDeleteUser(user.id) && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}
    </div>
  )
}
