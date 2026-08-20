'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Project, Priority, PRIORITY_CONFIG } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Dropdown from '@/components/ui/Dropdown';
import Modal from '@/components/ui/Modal';
import {
  Plus,
  Search,
  LayoutGrid,
  SlidersHorizontal,
  MoreHorizontal,
  Trash2,
  FolderKanban,
  CircleDot,
  Flag,
  Users,
  Calendar,
  Tag,
  UserCircle,
  Eye,
} from 'lucide-react';

interface FieldVisibility {
  status: boolean;
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  teams: boolean;
  labels: boolean;
  reporter: boolean;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState<Priority>('NO_PRIORITY');
  const [showFields, setShowFields] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fields, setFields] = useState<FieldVisibility>({
    status: true, priority: true, members: true, dueDate: true, teams: false, labels: false, reporter: false,
  });

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await api.createProject({ name: newProjectName, priority: newProjectPriority });
      setNewProjectName('');
      setNewProjectPriority('NO_PRIORITY');
      setShowAddModal(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdatePriority = async (projectId: string, priority: Priority) => {
    try {
      await api.updateProject(projectId, { priority });
      loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const filteredProjects = projects.filter(
    (p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fieldItems = [
    { key: 'status', label: 'Status', icon: <CircleDot className="w-4 h-4" /> },
    { key: 'priority', label: 'Priority', icon: <Flag className="w-4 h-4" /> },
    { key: 'members', label: 'Members', icon: <Users className="w-4 h-4" /> },
    { key: 'dueDate', label: 'Due Date', icon: <Calendar className="w-4 h-4" /> },
    { key: 'teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
    { key: 'labels', label: 'Labels', icon: <Tag className="w-4 h-4" /> },
    { key: 'reporter', label: 'Reporter', icon: <UserCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Projects</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-300"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Fields dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFields(!showFields)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
              >
                <LayoutGrid className="w-4 h-4" /> Fields
              </button>
              {showFields && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 rounded-xl border shadow-lg py-1 z-30"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}
                >
                  {fieldItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setFields((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof FieldVisibility] }))}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.icon}
                      {item.label}
                      {fields[item.key as keyof FieldVisibility] && (
                        <Eye className="w-3.5 h-3.5 ml-auto" style={{ color: 'var(--text-tertiary)' }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>

            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
            <div className="col-span-8">Projects</div>
            <div className="col-span-3">Priority</div>
            <div className="col-span-1"></div>
          </div>

          {/* Project rows */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
              style={{ borderColor: 'var(--border-secondary)' }}
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="col-span-8 flex items-center gap-2">
                <FolderKanban className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</span>
              </div>
              <div className="col-span-3">
                <Badge priority={project.priority} />
              </div>
              <div className="col-span-1 flex items-center justify-end relative">
                <button
                  onClick={(e) => { e.stopPropagation(); /* handle menu */ }}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <MoreHorizontal className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Priority</label>
            <Dropdown
              options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
                value,
                label: config.label,
              }))}
              value={newProjectPriority}
              onChange={(v) => setNewProjectPriority(v as Priority)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
