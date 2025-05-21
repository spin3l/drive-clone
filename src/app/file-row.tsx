import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { FolderIcon, MoreVertical } from "lucide-react";
import React from "react";
import type { File, Folder } from "@/lib/mock-data";

interface FileRowProps {
  item: File | Folder;
  getFileIcon: (name: string) => React.ReactNode;
  navigateToFolder: (id: string) => void;
}

function FileRow({ item, getFileIcon, navigateToFolder }: FileRowProps) {
  return (
    <tr key={item.id} className="hover:bg-muted/50 border-b">
      <td
        className="cursor-pointer p-3"
        onClick={() =>
          item.type === "folder"
            ? navigateToFolder(item.id)
            : window.open("#", "_blank")
        }
      >
        <div className="flex items-center gap-3">
          {item.type === "folder" ? (
            <FolderIcon className="h-5 w-5 text-blue-500" />
          ) : (
            getFileIcon(item.name)
          )}
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      </td>
      <td className="text-muted-foreground hidden p-3 text-sm md:table-cell">
        {"size" in item ? item.size : "--"}
      </td>
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
  );
}

export default FileRow;
