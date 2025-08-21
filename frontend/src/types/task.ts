export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo: string
  assignedToEmail?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  attachments?: string[]
}

export interface TaskFormData {
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo: string
}
