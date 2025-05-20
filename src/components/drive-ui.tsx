"use client"

import { useState } from "react"
import {
  File,
  FileText,
  Folder,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Star,
  Trash,
  Upload,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for files and folders
const mockData = {
  root: [
    { id: "1", name: "Documents", type: "folder", updatedAt: "May 15, 2025", size: "-" },
    { id: "2", name: "Images", type: "folder", updatedAt: "May 10, 2025", size: "-" },
    { id: "3", name: "Project Files", type: "folder", updatedAt: "May 5, 2025", size: "-" },
    { id: "4", name: "Budget 2025.xlsx", type: "file", updatedAt: "May 18, 2025", size: "1.2 MB" },
    { id: "5", name: "Meeting Notes.docx", type: "file", updatedAt: "May 17, 2025", size: "245 KB" },
  ],
  "1": [
    { id: "6", name: "Work", type: "folder", updatedAt: "May 12, 2025", size: "-" },
    { id: "7", name: "Personal", type: "folder", updatedAt: "May 11, 2025", size: "-" },
    { id: "8", name: "Resume.pdf", type: "file", updatedAt: "May 14, 2025", size: "420 KB" },
    { id: "9", name: "Contract.pdf", type: "file", updatedAt: "May 13, 2025", size: "1.5 MB" },
  ],
  "2": [
    { id: "10", name: "Vacation", type: "folder", updatedAt: "May 9, 2025", size: "-" },
    { id: "11", name: "Profile.jpg", type: "file", updatedAt: "May 8, 2025", size: "2.3 MB" },
    { id: "12", name: "Banner.png", type: "file", updatedAt: "May 7, 2025", size: "4.1 MB" },
  ],
  "3": [
    { id: "13", name: "Frontend", type: "folder", updatedAt: "May 4, 2025", size: "-" },
    { id: "14", name: "Backend", type: "folder", updatedAt: "May 3, 2025", size: "-" },
    { id: "15", name: "README.md", type: "file", updatedAt: "May 2, 2025", size: "12 KB" },
  ],
  "6": [
    { id: "16", name: "Presentations", type: "folder", updatedAt: "May 1, 2025", size: "-" },
    { id: "17", name: "Proposal.docx", type: "file", updatedAt: "Apr 30, 2025", size: "350 KB" },
  ],
  "7": [
    { id: "18", name: "Taxes", type: "folder", updatedAt: "Apr 29, 2025", size: "-" },
    { id: "19", name: "Journal.txt", type: "file", updatedAt: "Apr 28, 2025", size: "45 KB" },
  ],
  "10": [
    { id: "20", name: "Beach.jpg", type: "file", updatedAt: "Apr 27, 2025", size: "3.2 MB" },
    { id: "21", name: "Mountains.jpg", type: "file", updatedAt: "Apr 26, 2025", size: "2.8 MB" },
  ],
  "13": [
    { id: "22", name: "index.html", type: "file", updatedAt: "Apr 25, 2025", size: "5 KB" },
    { id: "23", name: "styles.css", type: "file", updatedAt: "Apr 24, 2025", size: "8 KB" },
    { id: "24", name: "app.js", type: "file", updatedAt: "Apr 23, 2025", size: "12 KB" },
  ],
  "14": [
    { id: "25", name: "server.js", type: "file", updatedAt: "Apr 22, 2025", size: "15 KB" },
    { id: "26", name: "database.sql", type: "file", updatedAt: "Apr 21, 2025", size: "3 KB" },
  ],
  "16": [
    { id: "27", name: "Q1 Results.pptx", type: "file", updatedAt: "Apr 20, 2025", size: "2.5 MB" },
    { id: "28", name: "Product Launch.pptx", type: "file", updatedAt: "Apr 19, 2025", size: "3.8 MB" },
  ],
  "18": [
    { id: "29", name: "2024 Tax Return.pdf", type: "file", updatedAt: "Apr 18, 2025", size: "1.7 MB" },
    { id: "30", name: "Receipts.zip", type: "file", updatedAt: "Apr 17, 2025", size: "5.2 MB" },
  ],
}

// Path mapping for breadcrumb navigation
const pathMap = {
  "1": { name: "Documents", parent: "root" },
  "2": { name: "Images", parent: "root" },
  "3": { name: "Project Files", parent: "root" },
  "6": { name: "Work", parent: "1" },
  "7": { name: "Personal", parent: "1" },
  "10": { name: "Vacation", parent: "2" },
  "13": { name: "Frontend", parent: "3" },
  "14": { name: "Backend", parent: "3" },
  "16": { name: "Presentations", parent: "6" },
  "18": { name: "Taxes", parent: "7" },
}

export function DriveUI() {
  const [currentFolder, setCurrentFolder] = useState("root")
  const [viewMode, setViewMode] = useState("grid")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([{ id: "root", name: "My Drive" }])

  // Navigate to a folder
  const navigateToFolder = (folderId: string, folderName: string) => {
    if (folderId === "root") {
      setBreadcrumbs([{ id: "root", name: "My Drive" }])
    } else {
      // Build breadcrumb path
      const newBreadcrumbs = [{ id: "root", name: "My Drive" }]
      let currentId = folderId
      const path = []

      while (currentId !== "root") {
        const folder = pathMap[currentId as keyof typeof pathMap]
        if (folder) {
          path.unshift({ id: currentId, name: folder.name })
          currentId = folder.parent
        } else {
          break
        }
      }

      setBreadcrumbs([...newBreadcrumbs, ...path])
    }

    setCurrentFolder(folderId)
  }

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="w-10 h-10 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="w-10 h-10 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText className="w-10 h-10 text-green-500" />
      case "ppt":
      case "pptx":
        return <FileText className="w-10 h-10 text-orange-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileText className="w-10 h-10 text-purple-500" />
      default:
        return <FileText className="w-10 h-10 text-gray-500" />
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <File className="h-6 w-6 text-blue-500" />
            Drive
          </h1>
          <div className="flex-1 ml-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search in Drive" className="w-full max-w-lg pl-8 bg-muted/50" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/50 hidden md:block">
          <div className="flex flex-col gap-1 p-4">
            <div className="px-2 py-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload file</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Folder className="mr-2 h-4 w-4" />
                    <span>New folder</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button variant="ghost" className="justify-start gap-2">
              <File className="h-4 w-4" />
              <span>My Drive</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Users className="h-4 w-4" />
              <span>Shared with me</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Star className="h-4 w-4" />
              <span>Starred</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Trash className="h-4 w-4" />
              <span>Trash</span>
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            {/* Breadcrumb and actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center">
                    {index > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal"
                      onClick={() => navigateToFolder(crumb.id, crumb.name)}
                    >
                      {crumb.name}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Upload button for mobile */}
            <div className="md:hidden mb-4">
              <Button className="w-full justify-center gap-2" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>

            {/* Files and folders */}
            <Tabs defaultValue="all" className="mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="folders">Folders</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
            </Tabs>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mockData[currentFolder as keyof typeof mockData]?.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() =>
                      item.type === "folder" ? navigateToFolder(item.id, item.name) : window.open("#", "_blank")
                    }
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      {item.type === "folder" ? <Folder className="w-10 h-10 text-blue-500" /> : getFileIcon(item.name)}
                      <div className="w-full">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-sm">Name</th>
                      <th className="text-left p-3 font-medium text-sm hidden md:table-cell">Last modified</th>
                      <th className="text-left p-3 font-medium text-sm hidden md:table-cell">Size</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData[currentFolder as keyof typeof mockData]?.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td
                          className="p-3 cursor-pointer"
                          onClick={() =>
                            item.type === "folder" ? navigateToFolder(item.id, item.name) : window.open("#", "_blank")
                          }
                        >
                          <div className="flex items-center gap-3">
                            {item.type === "folder" ? (
                              <Folder className="w-5 h-5 text-blue-500" />
                            ) : (
                              getFileIcon(item.name)
                            )}
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{item.updatedAt}</td>
                        <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{item.size}</td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>Drag and drop files here or click to browse</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-10 text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
              <Button size="sm" className="mt-2">
                Choose files
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
