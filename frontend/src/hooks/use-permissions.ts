
import { useAuth } from "@/contexts/auth-context"
import type { Task } from "@/types/task"

export function usePermissions() {
  const { user } = useAuth()

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const canViewAllTasks = () => {
    return isAdmin()
  }

  const canCreateTask = () => {
    return !!user // Any authenticated user can create tasks
  }

  const canEditTask = (task: Task) => {
    if (!user) return false
    if (isAdmin()) return true
    return task.assignedTo === user.id || task.createdBy === user.id
  }

  const canDeleteTask = (task: Task) => {
    if (!user) return false
    if (isAdmin()) return true
    return task.createdBy === user.id
  }

  const canAssignTaskToOthers = () => {
    return isAdmin()
  }

  const canViewTask = (task: Task) => {
    if (!user) return false
    if (isAdmin()) return true
    return task.assignedTo === user.id || task.createdBy === user.id
  }

  const canManageUsers = () => {
    return isAdmin()
  }

  const canViewUserManagement = () => {
    return isAdmin()
  }

  const canEditUser = (userId: string) => {
    if (!user) return false
    if (isAdmin()) return true
    return user.id === userId
  }

  const canDeleteUser = (userId: string) => {
    if (!user) return false
    if (!isAdmin()) return false
    return user.id !== userId // Admin can't delete themselves
  }

  const getVisibleTasks = (tasks: Task[]) => {
    if (!user) return []
    if (isAdmin()) return tasks
    return tasks.filter((task) => task.assignedTo === user.id || task.createdBy === user.id)
  }

  const getAssignableUsers = (allUsers: Array<{ id: string; email: string; role: string }>) => {
    if (!user) return []
    if (isAdmin()) return allUsers
    return allUsers.filter((u) => u.id === user.id) // Non-admin can only assign to themselves
  }

  return {
    isAdmin,
    canViewAllTasks,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canAssignTaskToOthers,
    canViewTask,
    canManageUsers,
    canViewUserManagement,
    canEditUser,
    canDeleteUser,
    getVisibleTasks,
    getAssignableUsers,
  }
}
