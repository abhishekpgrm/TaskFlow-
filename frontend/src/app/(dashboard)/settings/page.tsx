'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { User, Moon, Sun, Palette, ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';

type SettingsTab = 'profile' | 'theme' | 'color';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    title: user?.title || '',
    username: user?.username || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'theme' as SettingsTab, label: 'Theme', icon: theme === 'dark' ? Moon : Sun },
    { id: 'color' as SettingsTab, label: 'Color', icon: Palette },
  ];

  return (
    <div className="h-full flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Settings sidebar */}
      <div className="w-48 border-r flex-shrink-0 p-4 hidden md:block" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to app
        </Link>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
          />
        </div>

        <nav className="space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              style={{ color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t flex z-30" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              activeTab === tab.id ? 'font-medium' : ''
            }`}
            style={{ color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-2xl">
          {/* Mobile back link */}
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 text-sm mb-4 md:hidden hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to app
          </Link>

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Profile</h2>

              <div className="rounded-xl border p-6 space-y-6" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                {/* Profile picture */}
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Profile picture</span>
                  <Avatar name={user?.fullName || 'Guest'} size="lg" />
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="text-sm sm:text-right px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-auto"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    />
                    <Pencil className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                </div>

                {/* Full name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Full name</span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="text-sm sm:text-right px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-40"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm block" style={{ color: 'var(--text-secondary)' }}>Title</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Your job title or role</span>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Designer"
                    className="text-sm sm:text-right px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-40"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Username */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm block" style={{ color: 'var(--text-secondary)' }}>Username</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>One word, like a nickname or first name</span>
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="text-sm sm:text-right px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-40"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                </div>

                {/* Workspace access */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Workspace access</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remove yourself from the workspace</span>
                    <Button variant="danger" size="sm">Leave Workspace</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Theme</h2>
              <div className="rounded-xl border p-6" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Choose your preferred theme. Your selection is saved automatically.</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      theme === 'light' ? 'border-gray-900 dark:border-white ring-2 ring-gray-900/20 dark:ring-white/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-3 text-gray-900" />
                    <p className="text-sm font-medium text-gray-900">Light</p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      theme === 'dark' ? 'border-gray-900 dark:border-white ring-2 ring-gray-900/20 dark:ring-white/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: '#1f2937' }}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-3 text-white" />
                    <p className="text-sm font-medium text-white">Dark</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Color</h2>
              <div className="rounded-xl border p-6" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Accent color customization</p>
                <div className="flex flex-wrap gap-3">
                  {['#000000', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1'].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
