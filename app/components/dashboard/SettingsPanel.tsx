'use client';

import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'range';
  value: unknown;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  validation?: (value: unknown) => string | null;
  onChange: (value: unknown) => void;
}

interface SettingGroup {
  id: string;
  title: string;
  description?: string;
  items: SettingItem[];
}

/**
 * Reusable Settings Panel Component
 */
export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  title = 'Settings',
  children 
}: SettingsPanelProps) {

  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Save Message */}
          
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Group Component
 */
export function SettingsGroup({ group }: { group: SettingGroup }) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{group.title}</h3>
        {group.description && (
          <p className="mt-1 text-sm text-gray-600">{group.description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {group.items.map((item) => (
          <SettingItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Setting Item Component
 */
export function SettingItem({ item }: { item: SettingItem }) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: unknown) => {
    // Validate if validation function is provided
    if (item.validation) {
      const validationError = item.validation(value);
      setError(validationError);
      if (validationError) return;
    } else {
      setError(null);
    }

    item.onChange(value);
  };

  const renderControl = () => {
    switch (item.type) {
      case 'toggle':
        return (
          <button
            type="button"
            onClick={() => handleChange(!(item.value as boolean))}
            className={`${
              (item.value as boolean) ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                (item.value as boolean) ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        );

      case 'select':
        return (
          <select
            value={item.value as string}
            onChange={(e) => handleChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {item.options?.map((option) => (
              <option key={option.value as string} value={option.value as string}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={item.value as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={item.placeholder}
            className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        );

      case 'range':
        return (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{item.min}</span>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step || 1}
              value={item.value as number}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">{item.max}</span>
            <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
              {item.value as number}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1 min-w-0 pr-4">
        <label className="text-sm font-medium text-gray-900">
          {item.label}
        </label>
        {item.description && (
          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {renderControl()}
      </div>
    </div>
  );
}

/**
 * Settings Section Component
 */
export function SettingsSection({ 
  title, 
  description, 
  children,
  icon
}: { 
  title: string; 
  description?: string; 
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const Icon = icon;

  return (
    <div className="mb-8">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-gray-600 mr-2" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * Settings Info Box Component
 */
export function SettingsInfoBox({ 
  type = 'info', 
  title, 
  children 
}: { 
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const icons = {
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
    error: ExclamationTriangleIcon,
    success: CheckIcon
  };

  const Icon = icons[type];

  return (
    <div className={`rounded-md border p-4 mb-4 ${styles[type]}`}>
      <div className="flex">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="ml-3">
          {title && (
            <h4 className="text-sm font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Action Button Component
 */
export function SettingsActionButton({
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children
}: {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${(disabled || loading) ? disabledClasses : ''}
      `}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

/**
 * Hook for managing settings panel state
 */
export function useSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const openPanel = (section?: string) => {
    setIsOpen(true);
    if (section) setActiveSection(section);
  };

  const closePanel = () => {
    setIsOpen(false);
    setActiveSection(null);
  };

  return {
    isOpen,
    activeSection,
    openPanel,
    closePanel,
    setActiveSection
  };
}