import { Project } from '@/types';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import { Plus, Search, SlidersHorizontal, LayoutGrid, FolderOpen } from 'lucide-react';

interface TaskToolbarProps {
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  breadcrumbProject: string;
  onAddTask: () => void;
}

export default function TaskToolbar({
  projects,
  selectedProject,
  setSelectedProject,
  searchQuery,
  setSearchQuery,
  breadcrumbProject,
  onAddTask
}: TaskToolbarProps) {
  return (
    <div className="border-b border-primary bg-primary px-6 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm mb-3 text-secondary">
        <FolderOpen className="w-4 h-4" />
        <span>Projects</span>
        {breadcrumbProject && (
          <>
            <span>&gt;</span>
            <span className="text-primary font-medium">{breadcrumbProject}</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-primary">Tasks</h1>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-primary bg-primary text-primary text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Project filter */}
          <Dropdown
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p.id, label: p.name })),
            ]}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="All Projects"
          />

          {/* Fields */}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary text-secondary text-sm hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <LayoutGrid className="w-4 h-4" />
            Fields
          </button>

          {/* Filter */}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary text-secondary text-sm hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>

          {/* Add Task */}
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={onAddTask}>
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
}
