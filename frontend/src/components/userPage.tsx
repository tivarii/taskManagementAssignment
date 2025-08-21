
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { UserList } from "@/components/users/user-list"

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6">
          <UserList />
        </main>
      </div>
    </ProtectedRoute>
  )
}
