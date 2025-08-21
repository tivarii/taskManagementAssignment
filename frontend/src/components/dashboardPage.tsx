

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckSquare, Clock, AlertCircle, Shield } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const permissions = usePermissions()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.email}! Here's an overview of your tasks.</p>
              </div>
              <Badge variant={permissions.isAdmin() ? "default" : "secondary"} className="capitalize">
                <Shield className="h-3 w-3 mr-1" />
                {user?.role}
              </Badge>
            </div>

            {!permissions.canViewAllTasks() && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      You're viewing a personalized dashboard. You can only see tasks assigned to you or created by you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {permissions.canViewAllTasks() ? "Total Tasks" : "Your Tasks"}
                  </CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>

              {permissions.isAdmin() && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Active users</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>
                  {permissions.canViewAllTasks()
                    ? "Most recently updated tasks across all users"
                    : "Your most recently updated tasks"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Update user interface</p>
                      <p className="text-sm text-muted-foreground">Due: Tomorrow</p>
                    </div>
                    <div className="text-sm text-orange-600">In Progress</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Review code changes</p>
                      <p className="text-sm text-muted-foreground">Due: Today</p>
                    </div>
                    <div className="text-sm text-red-600">Overdue</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Write documentation</p>
                      <p className="text-sm text-muted-foreground">Due: Next week</p>
                    </div>
                    <div className="text-sm text-blue-600">To Do</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
