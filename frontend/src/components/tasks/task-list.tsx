
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Edit, Trash2, Calendar, User, AlertCircle, Lock } from "lucide-react"
import { TaskForm } from "./task-form"
import { TaskDetails } from "./task-details"
import { TaskFiltersComponent, type TaskFilters } from "./task-filters"
import { usePagination } from "@/hooks/use-pagination"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import type { Task } from "@/types/task"

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    status: "all",
    priority: "all",
    assignedTo: "all",
    dueDateFrom: undefined,
    dueDateTo: undefined,
    createdDateFrom: undefined,
    createdDateTo: undefined,
  })
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewingTask, setViewingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const permissions = usePermissions()

  // Mock users data
  const users = [
    { id: "1", email: "admin@example.com", role: "admin" },
    { id: "2", email: "user1@example.com", role: "user" },
    { id: "3", email: "user2@example.com", role: "user" },
  ]

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTasks: Task[] = Array.from({ length: 25 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Task ${i + 1}: ${["Update user interface", "Review code changes", "Write documentation", "Fix bug in login", "Implement new feature"][i % 5]}`,
      description: `Description for task ${i + 1}. This is a detailed description of what needs to be done.`,
      status: ["todo", "in-progress", "completed"][i % 3] as "todo" | "in-progress" | "completed",
      priority: ["low", "medium", "high"][i % 3] as "low" | "medium" | "high",
      dueDate: new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assignedTo: ((i % 3) + 1).toString(),
      assignedToEmail: users[i % 3].email,
      createdBy: ((i % 2) + 1).toString(), // Mix of creators
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      attachments: i % 4 === 0 ? [`document-${i + 1}.pdf`] : [],
    }))
    setTasks(mockTasks)
    setLoading(false)
  }, [])

  // Filter tasks based on permissions and user filters
  const filteredAndSortedTasks = useMemo(() => {
    // First apply permission-based filtering
    const visibleTasks = permissions.getVisibleTasks(tasks)

    // Then apply user filters
    const filtered = visibleTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = filters.status === "all" || task.status === filters.status
      const matchesPriority = filters.priority === "all" || task.priority === filters.priority
      const matchesAssignedTo = filters.assignedTo === "all" || task.assignedTo === filters.assignedTo

      const taskDueDate = new Date(task.dueDate)
      const matchesDueDateFrom = !filters.dueDateFrom || taskDueDate >= filters.dueDateFrom
      const matchesDueDateTo = !filters.dueDateTo || taskDueDate <= filters.dueDateTo

      const taskCreatedDate = new Date(task.createdAt)
      const matchesCreatedDateFrom = !filters.createdDateFrom || taskCreatedDate >= filters.createdDateFrom
      const matchesCreatedDateTo = !filters.createdDateTo || taskCreatedDate <= filters.createdDateTo

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignedTo &&
        matchesDueDateFrom &&
        matchesDueDateTo &&
        matchesCreatedDateFrom &&
        matchesCreatedDateTo
      )
    })

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "priority": {
          const priorityOrder = { low: 1, medium: 2, high: 3 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        }
        case "dueDate":
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = a.dueDate
          bValue = b.dueDate
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [tasks, filters, sortBy, sortOrder, permissions])

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredAndSortedTasks,
    itemsPerPage,
  })

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    if (!permissions.canCreateTask()) {
      alert("You don't have permission to create tasks")
      return
    }

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdBy: user?.id || "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    if (!editingTask || !permissions.canEditTask(editingTask)) {
      alert("You don't have permission to edit this task")
      return
    }

    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
    }
    setTasks(tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || !permissions.canDeleteTask(task)) {
      alert("You don't have permission to delete this task")
      return
    }

    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const handleEditTask = (task: Task) => {
    if (!permissions.canEditTask(task)) {
      alert("You don't have permission to edit this task")
      return
    }
    setEditingTask(task)
  }

  const handleViewTask = (task: Task) => {
    if (!permissions.canViewTask(task)) {
      alert("You don't have permission to view this task")
      return
    }
    setViewingTask(task)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      assignedTo: "all",
      dueDateFrom: undefined,
      dueDateTo: undefined,
      createdDateFrom: undefined,
      createdDateTo: undefined,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          {!permissions.canViewAllTasks() && (
            <p className="text-sm text-muted-foreground mt-1">Showing only tasks assigned to you or created by you</p>
          )}
        </div>
        {permissions.canCreateTask() && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task and assign it to a team member.</DialogDescription>
              </DialogHeader>
              <TaskForm onSubmit={handleCreateTask} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <TaskFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        users={permissions.getAssignableUsers(users)}
        onReset={resetFilters}
      />

      {/* Sort and View Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{endIndex} of {totalItems} tasks
          </span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((task) => (
          <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle
                  className="text-lg leading-tight cursor-pointer hover:text-primary"
                  onClick={() => handleViewTask(task)}
                >
                  {task.title}
                  {!permissions.canViewTask(task) && <Lock className="inline h-4 w-4 ml-2 text-muted-foreground" />}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  {permissions.canEditTask(task) && (
                    <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {permissions.canDeleteTask(task) && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {!permissions.canEditTask(task) && !permissions.canDeleteTask(task) && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2">{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className={isOverdue(task.dueDate) ? "text-red-600" : ""}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                {isOverdue(task.dueDate) && <AlertCircle className="h-4 w-4 text-red-600" />}
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{task.assignedToEmail}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{task.createdBy === user?.id ? "Created by you" : "Created by others"}</span>
                {task.assignedTo === user?.id && (
                  <Badge variant="outline" className="text-xs">
                    Assigned to you
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paginatedData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {permissions.canViewAllTasks()
              ? "No tasks found matching your criteria."
              : "No tasks assigned to you or created by you match your criteria."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={previousPage}
                className={!canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => goToPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={!canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Edit Task Dialog */}
      <Dialog
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task information and assignment.</DialogDescription>
          </DialogHeader>
          <TaskForm initialData={editingTask} onSubmit={handleUpdateTask} isEditing />
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog
        open={viewingTask !== null}
        onOpenChange={(open) => {
          if (!open) setViewingTask(null)
        }}
      >
        <DialogContent className="max-w-3xl">
          <TaskDetails task={viewingTask} onClose={() => setViewingTask(null)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
