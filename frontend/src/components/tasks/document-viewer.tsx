
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, ExternalLink } from "lucide-react"
import { tasksApi } from "@/lib/api"

interface Document {
  id: number
  fileName: string
  filePath: string
  uploadedAt: string
}

interface DocumentViewerProps {
  documents: Document[]
  taskTitle: string
}

export function DocumentViewer({ documents, taskTitle }: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2" />
            Documents
          </CardTitle>
          <CardDescription>No documents attached to this task</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleDownload = (doc: Document) => {
    const downloadUrl = tasksApi.downloadDocument(doc.id)
    const link = window.document.createElement("a")
    link.href = downloadUrl
    link.download = doc.fileName
    link.click()
  }

  const handleView = (document: Document) => {
    setSelectedDocument(document)
  }

  const formatFileSize = (document: Document) => {
    // In a real app, file size would come from backend
    return "PDF Document"
  }

  const formatUploadDate = (uploadedAt: string) => {
    return new Date(uploadedAt).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documents
          </div>
          <Badge variant="secondary">{documents.length}/3</Badge>
        </CardTitle>
        <CardDescription>PDF documents attached to "{taskTitle}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={document.fileName}>
                  {document.fileName}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <span>{formatFileSize(document)}</span>
                  <span>•</span>
                  <span>Uploaded {formatUploadDate(document.uploadedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => handleView(document)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      {selectedDocument?.fileName}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 bg-muted rounded-lg p-8 flex items-center justify-center">
                    {selectedDocument && (
                      <iframe
                        src={tasksApi.viewDocument(selectedDocument.id)}
                        className="w-full h-full border-0 rounded"
                        title={selectedDocument.fileName}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(tasksApi.viewDocument(document.id), "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
