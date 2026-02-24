"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth(); // Consume user data and logout function
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname(); 

  // 1. Logic for dynamic user display
  const fullName = user ? `${user.first_name} ${user.last_name}` : "User Name";
  const acronym = user 
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() 
    : "UN";

  // 2. Filter menu items based on user role
  const menuItems = [
    { name: 'Customers', href: '/customers', icon: '👥', adminOnly: true },
    { name: 'Policies', href: '/policies', icon: '🛡️', adminOnly: false },
    { name: 'Claims', href: '/claims', icon: '📋', adminOnly: false },
  ].filter(item => {
    // If it's an admin-only item, only show if user is admin
    if (item.adminOnly) return user?.role === 'admin' || 'Admin';
    return true;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // Use the context logout to clear state
    router.push('/login'); 
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="text-blue-600 font-black text-xl tracking-tight">IMS<span className="text-slate-900"> Portal</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-end px-8 relative z-20">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors"
            >
              {/* Dynamic Acronym */}
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold uppercase">
                {acronym}
              </div>
              {/* Dynamic Full Name */}
              <span className="text-sm font-semibold text-slate-700">{fullName}</span>
              <svg 
                className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-1 mb-1 border-b border-slate-50">
                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{user?.role}</p>
                </div>
                <button onClick={() => router.push('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" disabled>View Profile</button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Logout</button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}