export interface User {
  id: string;
  email: string | null;
  fullName: string;
  title: string | null;
  username: string;
  avatar: string | null;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  ownerId: string;
  owner?: User;
  tasks?: Task[];
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  labels: string[];
  projectId: string;
  project?: Project;
  assigneeId: string | null;
  assignee: User | null;
  reporterId: string | null;
  reporter: User | null;
  parentId: string | null;
  subtasks?: Task[];
  comments?: Comment[];
  _count?: { subtasks: number; comments: number };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
}

export type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export const STATUS_LABELS: Record<Status, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'Doing',
  COMPLETED: 'Completed',
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  NO_PRIORITY: { label: 'No Priority', color: 'text-gray-500', bg: 'bg-gray-50', dot: 'bg-gray-400' },
  URGENT: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-600' },
  HIGH: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
  LOW: { label: 'Low', color: 'text-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-400' },
};

export const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  Research: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Design: { bg: 'bg-pink-100', text: 'text-pink-700' },
  Development: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Testing: { bg: 'bg-green-100', text: 'text-green-700' },
  Deployment: { bg: 'bg-orange-100', text: 'text-orange-700' },
};
