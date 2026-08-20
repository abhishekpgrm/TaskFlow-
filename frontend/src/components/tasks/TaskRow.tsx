import { useRouter } from 'next/navigation';
import { Task, Status, STATUS_LABELS } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { format } from 'date-fns';
import { MoreHorizontal, Edit3, ArrowRight, Trash2 } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  status: Status;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

const STATUSES: Status[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export default function TaskRow({ task, status, activeMenu, setActiveMenu, onStatusChange, onDelete }: TaskRowProps) {
  const router = useRouter();

  return (
    <div
      className="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b border-secondary hover:bg-secondary/50 transition-colors cursor-pointer group"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <div className="col-span-5 truncate font-medium text-primary">
        {task.title}
      </div>
      <div className="col-span-2">
        <Badge priority={task.priority} />
      </div>
      <div className="col-span-2 flex items-center">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignee.fullName} size="sm" />
            <span className="text-xs truncate text-secondary">
              {task.assignee.fullName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        ) : (
          <span className="text-xs text-tertiary">—</span>
        )}
      </div>
      <div className="col-span-2 text-xs flex items-center text-secondary">
        {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : '—'}
      </div>
      <div className="col-span-1 flex items-center justify-end relative">
        <button
          onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === task.id ? null : task.id); }}
          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus:opacity-100"
          aria-label="Task Actions"
        >
          <MoreHorizontal className="w-4 h-4 text-secondary" />
        </button>
        {activeMenu === task.id && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border bg-primary border-primary shadow-lg py-1 z-30">
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${task.id}`); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-secondary transition-colors"
            >
              <Edit3 className="w-4 h-4" /> View Details
            </button>
            {STATUSES.filter((s) => s !== status).map((s) => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, s); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-secondary transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> Move to {STATUS_LABELS[s]}
              </button>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
