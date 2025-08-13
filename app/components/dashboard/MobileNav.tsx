'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  CogIcon,
  UserIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

interface MobileNavProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notifications?: number;
  onSearch?: () => void;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/dashboard/projects',
    icon: DocumentTextIcon,
    children: [
      { id: 'all-projects', label: 'All Projects', href: '/dashboard/projects', icon: DocumentTextIcon },
      { id: 'new-project', label: 'New Project', href: '/dashboard/projects/new', icon: DocumentTextIcon }
    ]
  },
  {
    id: 'billing',
    label: 'Billing',
    href: '/dashboard/billing',
    icon: CogIcon
  },
  {
    id: 'support',
    label: 'Support',
    href: '/dashboard/support',
    icon: UserIcon
  }
];

/**
 * Mobile Navigation Component with touch gestures and responsive design
 */
export default function MobileNav({ user, notifications = 0, onSearch }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  /**
   * Handle touch start
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  };

  /**
   * Handle touch move
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchEnd({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  };

  /**
   * Handle touch end - detect swipe gestures
   */
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Only handle horizontal swipes
    if (!isVerticalSwipe) {
      if (isLeftSwipe && isOpen) {
        setIsOpen(false);
      } else if (isRightSwipe && !isOpen) {
        setIsOpen(true);
      }
    }
  };

  /**
   * Toggle expanded state for nav items with children
   */
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  /**
   * Close navigation when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        overlayRef.current &&
        overlayRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  /**
   * Handle escape key to close navigation
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  /**
   * Prevent body scroll when nav is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  /**
   * Check if a nav item is active
   */
  const isActiveItem = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  /**
   * Render navigation item
   */
  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isActive = isActiveItem(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className="nav-item-container">
        <div
          className={`
            flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors
            ${level > 0 ? 'ml-4 pl-8' : ''}
            ${isActive 
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="flex items-center flex-1 text-left"
              aria-expanded={isExpanded}
              aria-controls={`submenu-${item.id}`}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              <ChevronRightIcon 
                className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center flex-1"
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Submenu */}
        {hasChildren && (
          <div
            id={`submenu-${item.id}`}
            className={`
              overflow-hidden transition-all duration-200 ease-in-out
              ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="py-1">
              {item.children!.map(child => renderNavItem(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open navigation menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <h1 className="ml-3 text-lg font-semibold text-gray-900">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Button */}
          {onSearch && (
            <button
              onClick={onSearch}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          )}

          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <BellIcon className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </Link>

          {/* User Avatar */}
          {user && (
            <Link
              href="/dashboard/profile"
              className="flex items-center p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Navigation */}
      <div
        ref={navRef}
        className={`
          fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SI</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">Sharp Ireland</span>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close navigation menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map(item => renderNavItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <CogIcon className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </div>
      </div>

      {/* Swipe indicator (optional visual cue) */}
      {!isOpen && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-blue-600 rounded-r-full opacity-20 lg:hidden pointer-events-none" />
      )}
    </>
  );
}

/**
 * Hook for mobile navigation state management
 */
export function useMobileNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);
  const toggleNav = () => setIsNavOpen(prev => !prev);

  return {
    isOpen: isNavOpen,
    openNav,
    closeNav,
    toggleNav
  };
}

/**
 * Mobile navigation context for global state management
 */
export const MobileNavContext = React.createContext<{
  isOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
} | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const navState = useMobileNav();

  return (
    <MobileNavContext.Provider value={navState}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNavContext() {
  const context = React.useContext(MobileNavContext);
  if (!context) {
    throw new Error('useMobileNavContext must be used within MobileNavProvider');
  }
  return context;
}