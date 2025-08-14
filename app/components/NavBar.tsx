"use client";

import Link from 'next/link';
import { useState } from 'react';
import { UserProfile } from '../types/dashboard';

interface NavBarProps {
  user?: UserProfile | null;
}

export default function NavBar({ user }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-[var(--bg-100)] bg-opacity-90 backdrop-blur-md z-50 border-b border-[var(--bg-300)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          {/* Left Navigation Links */}
          <nav id="desktop-nav-left" className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
              Services
            </Link>
          </nav>

          {/* Centered Logo/Brand */}
          <Link href="/" className="text-2xl font-bold text-[var(--text-100)] font-heading absolute left-1/2 transform -translate-x-1/2">
            Sharp Digital
          </Link>

          {/* Right Navigation Links */}
          <nav id="desktop-nav-right" className="flex items-center space-x-6">
            <Link href="/industries" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
              Industries
            </Link>
            
            {user ? (
              <div id="user-menu-container" className="relative">
                <button
                  id="user-menu-button"
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors"
                >
                  <img
                    id="user-avatar"
                    className="h-8 w-8 rounded-full"
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username || 'User')}&background=3b82f6&color=fff`}
                    alt={user.full_name || user.username || 'User'}
                  />
                  <span>{user.full_name || user.username || 'User'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-[var(--bg-300)]"
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-[var(--text-100)] hover:bg-[var(--bg-200)]"
                      onClick={closeUserMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-[var(--text-100)] hover:bg-[var(--bg-200)]"
                      onClick={closeUserMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      className="block px-4 py-2 text-sm text-[var(--text-100)] hover:bg-[var(--bg-200)]"
                      onClick={closeUserMenu}
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/contact" className="px-4 py-2 rounded-md bg-[var(--primary-100)] text-sm font-medium hover:bg-[var(--primary-200)] transition-colors contact-button-text-white">
                Contact Us
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          {/* Mobile Logo */}
          <Link href="/" className="text-xl font-bold text-[var(--text-100)] font-heading" onClick={closeMobileMenu}>
            Sharp Digital
          </Link>

          <div className="flex items-center space-x-2">
            {/* User Avatar (if logged in) */}
            {user && (
              <button
                id="mobile-user-menu-button"
                onClick={toggleUserMenu}
                className="flex items-center"
              >
                <img
                  id="mobile-user-avatar"
                  className="h-8 w-8 rounded-full"
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username || 'User')}&background=3b82f6&color=fff`}
                  alt={user.full_name || user.username || 'User'}
                />
              </button>
            )}

            {/* Hamburger Menu Button */}
            <button
              id="mobile-menu-button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-[var(--text-100)] hover:text-[var(--primary-100)] hover:bg-[var(--bg-200)] transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu-overlay"
            className="md:hidden absolute top-full left-0 w-full bg-[var(--bg-100)] bg-opacity-95 backdrop-blur-md border-b border-[var(--bg-300)] shadow-lg"
          >
            <nav id="mobile-nav-menu" className="flex flex-col py-4 px-4 space-y-4">
              <Link
                href="/"
                className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link
                href="/industries"
                className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                onClick={closeMobileMenu}
              >
                Industries
              </Link>
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                    onClick={closeMobileMenu}
                  >
                    Sign out
                  </Link>
                </>
              ) : (
                <Link
                  href="/contact"
                  className="mt-2 px-4 py-3 rounded-md bg-[var(--primary-100)] text-base font-medium hover:bg-[var(--primary-200)] transition-colors contact-button-text-white text-center"
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </Link>
              )}
            </nav>
          </div>
        )}
        
        {/* Mobile User Menu Dropdown */}
        {isUserMenuOpen && user && (
          <div
            id="mobile-user-dropdown-menu"
            className="md:hidden absolute top-full right-0 mt-2 mr-4 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-[var(--bg-300)]"
          >
            <div className="px-4 py-2 border-b border-[var(--bg-300)]">
              <p className="text-sm font-medium text-[var(--text-100)]">{user.full_name || user.username || 'User'}</p>
              {user.company && (
                <p className="text-xs text-[var(--text-200)]">{user.company}</p>
              )}
            </div>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-[var(--text-100)] hover:bg-[var(--bg-200)]"
              onClick={closeUserMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm text-[var(--text-100)] hover:bg-[var(--bg-200)]"
              onClick={closeUserMenu}
            >
              Profile
            </Link>
            <Link
              href="/api/auth/signout"
              className="block px-4 py-2 text-sm text-[var(--text-100)] hover:bg-[var(--bg-200)]"
              onClick={closeUserMenu}
            >
              Sign out
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
