'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import Avatar from '@/components/ui/Avatar';
import {
  CheckSquare,
  FolderKanban,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  const sidebarContent = (
    <>
      {/* User section */}
      <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={user?.fullName || 'Guest'} size="md" />
          <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {user?.fullName || 'Guest'}
          </span>
        </div>
        <Link
          href="/settings"
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <Settings className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </Link>
      </div>

      {/* Workspace section */}
      <div className="p-3">
        <button
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isWorkspaceOpen ? '' : '-rotate-90'}`} />
          Workspace
        </button>

        {isWorkspaceOpen && (
          <nav className="mt-1 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Logout at bottom */}
      <div className="mt-auto p-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg border shadow-sm lg:hidden"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[220px] flex flex-col border-r transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-primary)' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
