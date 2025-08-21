
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { TaskList } from "@/components/tasks/task-list"

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6">
          <TaskList />
        </main>
      </div>
    </ProtectedRoute>
  )
}
