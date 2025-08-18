'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, DashboardStats, Notification } from '../../types/dashboard';
import NotificationCenter from './NotificationCenter';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  stats: DashboardStats;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, stats }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [_loading, setLoading] = useState(true);

  // Navigation items
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      current: true
    },
    {
      id: 'projects',
      name: 'Projects',
      href: '/dashboard/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: stats.projects.active,
      current: false
    },
    {
      id: 'analytics',
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      current: false
    },
    {
      id: 'services',
      name: 'Services',
      href: '/dashboard/services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-8-8H6a2 2 0 00-2 2v6a2 2 0 002 2h2" />
        </svg>
      ),
      badge: stats.subscriptions.active,
      current: false
    },
    {
      id: 'billing',
      name: 'Billing',
      href: '/dashboard/billing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      badge: stats.invoices.pending > 0 ? stats.invoices.pending : undefined,
      current: false
    },
    {
      id: 'support',
      name: 'Support',
      href: '/dashboard/support',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12l.01.01M12 12l.01.01M12 12l.01.01M12 12l.01.01" />
        </svg>
      ),
      current: false
    }
  ];

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=20');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data?.data || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true, read_at: new Date().toISOString() }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ 
            ...notification, 
            read: true, 
            read_at: new Date().toISOString() 
          }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  

  return (
    <div id="dashboard-layout-container" className="min-h-screen bg-gray-50 flex pt-16">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div id="dashboard-sidebar" className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div id="sidebar-header" className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div id="sidebar-logo" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Dashboard</span>
          </div>
          <button
            id="sidebar-close-mobile"
            className="lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav id="sidebar-navigation" className="px-2">
          <div id="sidebar-nav-items" className="space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`mr-3 flex-shrink-0 ${
                  item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </div>
                {item.name}
                {item.badge !== undefined && item.badge > 0 && (
                  <span id={`sidebar-badge-${item.id}`} className="ml-auto inline-block py-0.5 px-3 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>

        {/* User profile section */}
        <div id="sidebar-user-profile" className="mt-auto p-4 border-t border-gray-200">
          <div id="sidebar-user-info" className="flex items-center">
            <img
              id="sidebar-user-avatar"
              className="h-10 w-10 rounded-full"
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username || 'User')}&background=3b82f6&color=fff`}
              alt={user.full_name || user.username || 'User'}
            />
            <div id="sidebar-user-details" className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.full_name || user.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.company || 'No company'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div id="dashboard-main-content" className="flex-1">
        {/* Mobile menu button for sidebar (only visible on mobile) */}
        <div className="sticky top-0 z-40 lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-2">
          <button
            id="mobile-menu-button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main id="dashboard-page-content" className="pt-6 pb-4">
          <div id="dashboard-content-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;