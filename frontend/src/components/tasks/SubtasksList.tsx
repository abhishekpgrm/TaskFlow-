import { useState } from 'react';
import { Task } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';
import { MoreHorizontal, Plus } from 'lucide-react';

interface SubtasksListProps {
  subtasks: Task[];
  onAddSubtask: (title: string) => Promise<void>;
}

export default function SubtasksList({ subtasks, onAddSubtask }: SubtasksListProps) {
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAdd = async () => {
    if (!newSubtaskTitle.trim()) return;
    await onAddSubtask(newSubtaskTitle);
    setNewSubtaskTitle('');
    setShowAddSubtask(false);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-primary">Subtasks</h3>
      <div className="rounded-xl border border-primary bg-primary overflow-hidden shadow-sm">
        {/* Subtask header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium border-b border-secondary bg-secondary text-secondary">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-3">Members</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {subtasks?.map((subtask) => (
          <div key={subtask.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b border-secondary hover:bg-secondary/50 transition-colors">
            <div className="col-span-4 truncate text-primary">{subtask.title}</div>
            <div className="col-span-2"><Badge priority={subtask.priority} /></div>
            <div className="col-span-3">
              {subtask.assignee ? (
                <div className="flex items-center gap-1.5">
                  <Avatar name={subtask.assignee.fullName} size="sm" />
                  <span className="text-xs text-secondary">{subtask.assignee.fullName.substring(0, 2).toUpperCase()}</span>
                </div>
              ) : <span className="text-xs text-tertiary">—</span>}
            </div>
            <div className="col-span-2 text-xs flex items-center text-secondary">
              {subtask.dueDate ? format(new Date(subtask.dueDate), 'dd MMM yyyy') : '—'}
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-tertiary">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add subtask */}
        {showAddSubtask ? (
          <div className="flex items-center gap-2 px-4 py-3">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Subtask title..."
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAddSubtask(false); }}
              className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-secondary text-primary text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <Button size="sm" onClick={handleAdd}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddSubtask(false)}>Cancel</Button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddSubtask(true)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-tertiary"
          >
            <Plus className="w-4 h-4" /> Add Subtasks
          </button>
        )}
      </div>
    </div>
  );
}
