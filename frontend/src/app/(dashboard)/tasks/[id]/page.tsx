'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task, Status, Priority, STATUS_LABELS, PRIORITY_CONFIG, LABEL_COLORS } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import DatePicker from '@/components/ui/DatePicker';
import SubtasksList from '@/components/tasks/SubtasksList';
import CommentsList from '@/components/tasks/CommentsList';
import {
  ArrowLeft,
  Bookmark,
  Share,
  MoreHorizontal,
  Plus,
  Calendar,
  Users,
  Tag,
  Flag,
  CircleDot,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const loadTask = useCallback(async () => {
    try {
      const data = await api.getTask(params.id as string);
      setTask(data);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => { loadTask(); }, [loadTask]);

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!task) return;
    try {
      const updated = await api.updateTask(task.id, data);
      setTask(updated);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!task) return;
    setIsSubmittingComment(true);
    try {
      await api.createComment(task.id, content);
      await loadTask();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddSubtask = async (title: string) => {
    if (!task) return;
    try {
      await api.createTask({
        title,
        projectId: task.projectId,
        parentId: task.id,
        status: 'TODO',
      });
      await loadTask();
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="h-full flex items-center justify-center bg-primary">
        <p className="text-secondary">Task not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row bg-primary">
      {/* Left Panel */}
      <div className="flex-1 overflow-auto border-r border-primary">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary bg-primary">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"><Bookmark className="w-4 h-4 text-secondary" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"><Share className="w-4 h-4 text-secondary" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"><MoreHorizontal className="w-4 h-4 text-secondary" /></button>
          </div>
        </div>

        <div className="p-6 space-y-8 bg-primary">
          <div>
            {/* Title */}
            <h1 className="text-2xl font-bold text-primary mb-3">{task.title}</h1>
            {/* Description */}
            {task.description && (
              <p className="text-sm leading-relaxed text-secondary">{task.description}</p>
            )}
          </div>

          {/* Properties row */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-secondary">Properties</span>
              {task.assignee && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary">
                  <Avatar name={task.assignee.fullName} size="sm" />
                  <span className="text-xs text-primary">{task.assignee.fullName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div>
              <h3 className="text-xs font-medium mb-2 text-secondary">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => {
                  const colors = LABEL_COLORS[label] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                  return (
                    <span
                      key={label}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtasks */}
          <SubtasksList subtasks={task.subtasks || []} onAddSubtask={handleAddSubtask} />

          {/* Comments */}
          <CommentsList 
            comments={task.comments || []} 
            currentUser={user} 
            onAddComment={handleAddComment} 
            isSubmitting={isSubmittingComment} 
          />
        </div>
      </div>

      {/* Right Panel - Details */}
      <div className="w-full lg:w-80 flex-shrink-0 overflow-auto bg-primary border-l border-primary">
        <div className="p-5">
          <h3 className="text-sm font-semibold mb-4 text-primary">● Details</h3>
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <CircleDot className="w-4 h-4" /> Status
              </div>
              <Dropdown
                options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                value={task.status}
                onChange={(v) => handleUpdateTask({ status: v as Status })}
                className="w-32"
              />
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Flag className="w-4 h-4" /> Priority
              </div>
              <Dropdown
                options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
                value={task.priority}
                onChange={(v) => handleUpdateTask({ priority: v as Priority })}
                className="w-32"
              />
            </div>

            {/* Members */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Users className="w-4 h-4" /> Members
              </div>
              <div className="flex items-center gap-1">
                {task.assignee && <Avatar name={task.assignee.fullName} size="sm" />}
                <button className="w-6 h-6 rounded-full border-2 border-dashed border-primary flex items-center justify-center hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <Plus className="w-3 h-3 text-tertiary" />
                </button>
              </div>
            </div>

            {/* Dates */}
            <div>
              <div className="flex items-center gap-2 text-sm mb-3 text-secondary">
                <Calendar className="w-4 h-4" /> Dates
                <div className="ml-auto flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded border border-primary text-secondary">
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No date'}
                  </span>
                  <span className="text-tertiary">End</span>
                </div>
              </div>
              <DatePicker
                value={task.dueDate ? new Date(task.dueDate) : null}
                onChange={(date) => handleUpdateTask({ dueDate: date?.toISOString() })}
              />
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Tag className="w-4 h-4" /> Labels
              </div>
              <div className="text-xs text-tertiary">Add label...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
