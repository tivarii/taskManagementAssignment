
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { Separator } from "@/components/ui/separator"
import { usePermissions } from "@/hooks/use-permissions"
import { useAuth } from "@/contexts/auth-context"
import type { Task, TaskFormData } from "@/types/task"

interface User {
  id: string
  email: string
  role: "admin" | "user"
}

interface TaskFormProps {
  initialData?: Task | null
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">) => void
  isEditing?: boolean
}

export function TaskForm({ initialData, onSubmit, isEditing = false }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "todo",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || "",
    assignedTo: initialData?.assignedTo || "",
  })
  const [users, setUsers] = useState<User[]>([])
  const [attachments, setAttachments] = useState<File[]>([])
  const [error, setError] = useState("")
  const permissions = usePermissions()
  const { user } = useAuth()

  // Mock users data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      { id: "1", email: "admin@example.com", role: "admin" },
      { id: "2", email: "user1@example.com", role: "user" },
      { id: "3", email: "user2@example.com", role: "user" },
    ]
    setUsers(mockUsers)

    if (!permissions.canAssignTaskToOthers() && !isEditing && user) {
      setFormData((prev) => ({ ...prev, assignedTo: user.id }))
    }
  }, [permissions, isEditing, user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }

    if (!formData.description.trim()) {
      setError("Description is required")
      return
    }

    if (!formData.dueDate) {
      setError("Due date is required")
      return
    }

    if (!formData.assignedTo) {
      setError("Please assign the task to a user")
      return
    }

    if (!permissions.canAssignTaskToOthers() && formData.assignedTo !== user?.id) {
      setError("You can only assign tasks to yourself")
      return
    }

    const assignedUser = users.find((user) => user.id === formData.assignedTo)

    // Convert File objects to file names for storage
    const attachmentNames = attachments.map((file) => file.name)
    const existingAttachments = initialData?.attachments || []
    const allAttachments = [...existingAttachments, ...attachmentNames]

    onSubmit({
      ...formData,
      assignedToEmail: assignedUser?.email || "",
      attachments: allAttachments,
    })
  }

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const assignableUsers = permissions.getAssignableUsers(users)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!permissions.canAssignTaskToOthers() && (
        <Alert>
          <AlertDescription>As a regular user, you can only assign tasks to yourself.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "todo" | "in-progress" | "completed") => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: "low" | "medium" | "high") => handleInputChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assign To</Label>
          <Select
            value={formData.assignedTo}
            onValueChange={(value) => handleInputChange("assignedTo", value)}
            disabled={!permissions.canAssignTaskToOthers() && assignableUsers.length === 1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {assignableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.email} {user.id === formData.assignedTo && !permissions.canAssignTaskToOthers() && "(You)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Attachments</Label>
        <p className="text-sm text-muted-foreground">Upload up to 3 PDF documents to attach to this task.</p>
        <FileUpload
          onFilesChange={setAttachments}
          maxFiles={3}
          acceptedTypes={[".pdf"]}
          maxSizePerFile={10}
          existingFiles={initialData?.attachments || []}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">{isEditing ? "Update Task" : "Create Task"}</Button>
      </div>
    </form>
  )
}
