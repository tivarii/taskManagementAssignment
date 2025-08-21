const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || "An error occurred")
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{
      token: string
      user: { id: number; email: string; role: string }
    }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response
  },

  register: async (email: string, password: string, role: "USER" | "ADMIN" = "USER") => {
    const response = await apiRequest<{
      message: string
      user: { id: number; email: string; role: string }
    }>("/users/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    })
    return response
  },
}

// Users API
export const usersApi = {
  getAll: async () => {
    return apiRequest<Array<{ id: number; email: string; role: string }>>("/users")
  },

  getById: async (id: number) => {
    return apiRequest<{ id: number; email: string; role: string }>(`/users/${id}`)
  },

  update: async (id: number, data: { email?: string; role?: string }) => {
    return apiRequest<{
      message: string
      user: { id: number; email: string; role: string }
    }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number) => {
    return apiRequest<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    })
  },
}

// Tasks API
export const tasksApi = {
  getAll: async (params?: {
    status?: string
    priority?: string
    dueDate?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    page?: number
    pageSize?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    return apiRequest<
      Array<{
        id: number
        title: string
        description: string
        status: string
        priority: string
        dueDate: string
        assignedToId: number
        assignedTo?: { id: number; email: string }
        createdAt: string
        updatedAt: string
        documents?: Array<{
          id: number
          fileName: string
          filePath: string
          uploadedAt: string
        }>
      }>
    >(`/tasks${queryString ? `?${queryString}` : ""}`)
  },

  getById: async (id: number) => {
    return apiRequest<{
      id: number
      title: string
      description: string
      status: string
      priority: string
      dueDate: string
      assignedToId: number
      assignedTo?: { id: number; email: string }
      createdAt: string
      updatedAt: string
      documents?: Array<{
        id: number
        fileName: string
        filePath: string
        uploadedAt: string
      }>
    }>(`/tasks/${id}`)
  },

  create: async (data: {
    title: string
    description: string
    status: string
    priority: string
    dueDate: string
    assignedToId: number
  }) => {
    return apiRequest<{
      id: number
      title: string
      description: string
      status: string
      priority: string
      dueDate: string
      assignedToId: number
      createdAt: string
      updatedAt: string
    }>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: number,
    data: Partial<{
      title: string
      description: string
      status: string
      priority: string
      dueDate: string
      assignedToId: number
    }>,
  ) => {
    return apiRequest<{
      id: number
      title: string
      description: string
      status: string
      priority: string
      dueDate: string
      assignedToId: number
      updatedAt: string
    }>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number) => {
    return apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
    })
  },

  uploadDocuments: async (taskId: number, files: File[]) => {
    const token = localStorage.getItem("token")
    const formData = new FormData()

    files.forEach((file) => {
      formData.append("documents", file)
    })

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/documents`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.message || "Upload failed")
    }

    return response.json()
  },

  viewDocument: (docId: number) => {
    const token = localStorage.getItem("token")
    return `${API_BASE_URL}/tasks/documents/${docId}/view?token=${token}`
  },

  downloadDocument: (docId: number) => {
    const token = localStorage.getItem("token")
    return `${API_BASE_URL}/tasks/documents/${docId}/download?token=${token}`
  },
}
