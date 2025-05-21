"use client";

import { useState } from "react";
import {
  File,
  FileText,
  Folder,
  Grid,
  List,
  Plus,
  Search,
  Settings,
  Star,
  Trash,
  Upload,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockFolders, mockFiles } from "@/lib/mock-data";
import FileRow from "@/app/file-row";

export function DriveUI() {
  const [currentFolder, setCurrentFolder] = useState("root");
  const [viewMode, setViewMode] = useState("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: string; name: string }[]
  >([{ id: "root", name: "My Drive" }]);

  // Build a map for folder navigation (id -> folder)
  const folderMap = Object.fromEntries(
    mockFolders.map((folder) => [folder.id, folder]),
  );

  // Get folders and files for the current folder
  const foldersInCurrent = mockFolders.filter(
    (f) => f.parent === currentFolder,
  );
  const filesInCurrent = mockFiles.filter((f) => f.parent === currentFolder);

  // Navigate to a folder
  const navigateToFolder = (folderId: string) => {
    if (folderId === "root") {
      setBreadcrumbs([{ id: "root", name: "My Drive" }]);
    } else {
      // Build breadcrumb path
      const newBreadcrumbs = [{ id: "root", name: "My Drive" }];
      let currentId = folderId;
      const path = [];

      while (currentId !== "root") {
        const folder = folderMap[currentId];
        if (folder) {
          path.unshift({ id: currentId, name: folder.name });
          currentId = folder.parent ?? "root";
        } else {
          break;
        }
      }

      setBreadcrumbs([...newBreadcrumbs, ...path]);
    }

    setCurrentFolder(folderId);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-10 w-10 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-10 w-10 text-orange-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileText className="h-10 w-10 text-purple-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center gap-4 px-4">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <File className="h-6 w-6 text-blue-500" />
            Drive
          </h1>
          <div className="ml-4 flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search in Drive"
                className="bg-muted/50 w-full max-w-lg pl-8"
              />
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
        <aside className="bg-muted/50 hidden w-64 border-r md:block">
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
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center">
                    {index > 0 && (
                      <span className="text-muted-foreground mx-1">/</span>
                    )}
                    <Button
                      variant="link"
                      className="h-auto p-0 font-normal"
                      onClick={() => navigateToFolder(crumb.id)}
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
            <div className="mb-4 md:hidden">
              <Button
                className="w-full justify-center gap-2"
                onClick={() => setUploadDialogOpen(true)}
              >
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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[...foldersInCurrent, ...filesInCurrent].map((item) => (
                  <div
                    key={item.id}
                    className="hover:bg-muted/50 cursor-pointer rounded-lg border p-3 transition-colors"
                    onClick={() =>
                      item.type === "folder"
                        ? navigateToFolder(item.id)
                        : window.open("#", "_blank")
                    }
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      {item.type === "folder" ? (
                        <Folder className="h-10 w-10 text-blue-500" />
                      ) : (
                        getFileIcon(item.name)
                      )}
                      <div className="w-full">
                        <p className="truncate text-sm font-medium">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-3 text-left text-sm font-medium">
                        Name
                      </th>
                      <th className="hidden p-3 text-left text-sm font-medium md:table-cell">
                        Last modified
                      </th>
                      <th className="hidden p-3 text-left text-sm font-medium md:table-cell">
                        Size
                      </th>
                      <th className="w-10 p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...foldersInCurrent, ...filesInCurrent].map((item) => (
                      <FileRow
                        key={item.id}
                        item={item}
                        getFileIcon={getFileIcon}
                        navigateToFolder={navigateToFolder}
                      />
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
            <DialogDescription>
              Drag and drop files here or click to browse
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border-2 border-dashed p-10 text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-muted-foreground h-10 w-10" />
              <p className="text-muted-foreground text-sm">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" className="mt-2">
                Choose files
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
