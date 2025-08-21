
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DocumentViewer } from "./document-viewer";
import { Calendar, User, Clock, AlertCircle } from "lucide-react";
import type { Task } from "@/types/task"; // Assuming you have a Task type defined

interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
}


export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">{task.title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
          <Badge className={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{task.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Due Date:</span>
              <span className={isOverdue(task.dueDate) ? "text-red-600 font-medium" : ""}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
              {isOverdue(task.dueDate) && <AlertCircle className="h-4 w-4 text-red-600" />}
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Assigned To:</span>
              <span>{task.assignedToEmail}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Updated:</span>
              <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        <DocumentViewer 
          documents={(task.attachments || []).map(url => ({ url }))} 
          taskTitle={task.title} 
        />
      </div>
    </div>
  );
}
