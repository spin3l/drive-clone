export type File = {
  id: string;
  name: string;
  url: string;
  parent: string;
  size: string;
  type: "file";
};

export type Folder = {
  id: string;
  name: string;
  parent: string | null;
  type: "folder";
};
export const mockFolders: Folder[] = [
  { id: "root", name: "root", parent: null, type: "folder" },
  { id: "1", name: "Documents", parent: "root", type: "folder" },
  { id: "2", name: "Pictures", parent: "root", type: "folder" },
  { id: "3", name: "Work", parent: "1", type: "folder" },
  { id: "4", name: "Personal", parent: "1", type: "folder" },
  { id: "5", name: "Vacation", parent: "2", type: "folder" },
];

export const mockFiles: File[] = [
  {
    id: "6",
    name: "resume.pdf",
    url: "/files/resume.pdf",
    parent: "1",
    size: "1.2 MB",
    type: "file",
  },
  {
    id: "7",
    name: "cover-letter.docx",
    url: "/files/cover-letter.docx",
    parent: "1",
    size: "800 KB",
    type: "file",
  },
  {
    id: "8",
    name: "project-plan.xlsx",
    url: "/files/project-plan.xlsx",
    parent: "3",
    size: "2.5 MB",
    type: "file",
  },
  {
    id: "9",
    name: "photo1.jpg",
    url: "/files/photo1.jpg",
    parent: "2",
    size: "3.1 MB",
    type: "file",
  },
  {
    id: "10",
    name: "photo2.png",
    url: "/files/photo2.png",
    parent: "2",
    size: "2.8 MB",
    type: "file",
  },
  {
    id: "11",
    name: "vacation-itinerary.pdf",
    url: "/files/vacation-itinerary.pdf",
    parent: "5",
    size: "900 KB",
    type: "file",
  },
  {
    id: "12",
    name: "taxes-2023.pdf",
    url: "/files/taxes-2023.pdf",
    parent: "4",
    size: "1.7 MB",
    type: "file",
  },
];
