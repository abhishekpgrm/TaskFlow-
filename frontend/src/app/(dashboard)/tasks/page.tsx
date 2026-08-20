'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task, Project, Status, STATUS_LABELS, Priority, PRIORITY_CONFIG } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Dropdown from '@/components/ui/Dropdown';
import TaskRow from '@/components/tasks/TaskRow';
import TaskToolbar from '@/components/tasks/TaskToolbar';
import { Plus, ChevronDown, CheckCircle2 } from 'lucide-react';

const STATUSES: Status[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingToStatus, setAddingToStatus] = useState<Status | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('NO_PRIORITY');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [breadcrumbProject, setBreadcrumbProject] = useState<string>('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projectsData, tasksData] = await Promise.all([
        api.getProjects(),
        api.getTasks(selectedProject ? { projectId: selectedProject } : {}),
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
      if (selectedProject) {
        const p = projectsData.find((p: Project) => p.id === selectedProject);
        setBreadcrumbProject(p?.name || '');
      } else {
        setBreadcrumbProject('');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleGroup = (status: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const handleAddTask = async (status: Status) => {
    if (!newTaskTitle.trim()) return;
    const projectId = selectedProject || projects[0]?.id;
    if (!projectId) return;
    try {
      await api.createTask({
        title: newTaskTitle,
        status,
        priority: newTaskPriority,
        projectId,
      });
      setNewTaskTitle('');
      setNewTaskPriority('NO_PRIORITY');
      setAddingToStatus(null);
      loadData();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      loadData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      setActiveMenu(null);
      loadData();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const filteredTasks = tasks.filter(
    (t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTasks = STATUSES.reduce((acc, status) => {
    acc[status] = filteredTasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<Status, Task[]>);

  const isEmptyState = !isLoading && tasks.length === 0 && !searchQuery;

  return (
    <div className="h-full flex flex-col bg-secondary">
      <TaskToolbar
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        breadcrumbProject={breadcrumbProject}
        onAddTask={() => setShowAddModal(true)}
      />

      {/* Task Groups */}
      <div className="flex-1 overflow-auto p-6">
        {isEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-primary rounded-xl bg-primary p-12">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No tasks found</h3>
            <p className="text-secondary mb-6 max-w-sm">
              You don't have any tasks in this project yet. Create a new task to get started.
            </p>
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
              Create First Task
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-primary overflow-hidden bg-primary shadow-sm">
            {STATUSES.map((status) => {
              const isCollapsed = collapsedGroups.has(status);
              const statusTasks = groupedTasks[status] || [];
              return (
                <div key={status}>
                  {/* Status header */}
                  <button
                    onClick={() => toggleGroup(status)}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold border-b border-secondary hover:bg-secondary transition-colors text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/50"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                    {STATUS_LABELS[status]}
                    <span className="text-xs font-normal px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary">
                      {statusTasks.length}
                    </span>
                  </button>

                  {!isCollapsed && (
                    <>
                      {/* Table header */}
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium border-b border-secondary bg-secondary text-secondary">
                        <div className="col-span-5">Task</div>
                        <div className="col-span-2">Priority</div>
                        <div className="col-span-2">Members</div>
                        <div className="col-span-2">Due Date</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>

                      {/* Task rows */}
                      {statusTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          status={status}
                          activeMenu={activeMenu}
                          setActiveMenu={setActiveMenu}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteTask}
                        />
                      ))}

                      {/* Add task row */}
                      {addingToStatus === status ? (
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-secondary">
                          <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Task title..."
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(status); if (e.key === 'Escape') setAddingToStatus(null); }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-primary text-primary text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                          <Dropdown
                            options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
                              value,
                              label: config.label,
                            }))}
                            value={newTaskPriority}
                            onChange={(v) => setNewTaskPriority(v as Priority)}
                            className="w-32"
                          />
                          <Button size="sm" onClick={() => handleAddTask(status)}>Add</Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddingToStatus(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingToStatus(status)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm border-b border-secondary hover:bg-secondary transition-colors text-tertiary focus:outline-none focus:bg-secondary focus:ring-2 focus:ring-inset focus:ring-blue-500/50"
                        >
                          <Plus className="w-4 h-4" /> Add Task
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Task">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-secondary">Title</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 rounded-xl border border-primary bg-secondary text-primary text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-secondary">Status</label>
              <Dropdown
                options={STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
                value="TODO"
                onChange={() => {}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-secondary">Priority</label>
              <Dropdown
                options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
                value={newTaskPriority}
                onChange={(v) => setNewTaskPriority(v as Priority)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-secondary">Project</label>
            <Dropdown
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              value={selectedProject || projects[0]?.id || ''}
              onChange={setSelectedProject}
              placeholder="Select project"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => { handleAddTask('TODO'); setShowAddModal(false); }}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
