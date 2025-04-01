"use client"

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import SideMenu from "@/app/_components/dashboard/SideMenu";

export default function DashboardLayout({ children }) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50 flex relative">
      {/* Toggle Button - Smaller size */}
      <button
        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
        className={`
          fixed top-1/2 -translate-y-1/2 z-50 
          p-1 rounded-r-md bg-white border border-gray-200 
          text-gray-600 hover:bg-gray-50
          transition-all duration-300 ease-in-out
          ${isSideMenuOpen ? 'sm:left-48 left-20' : 'left-0'}
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSideMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <SideMenu isOpen={isSideMenuOpen} />
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isSideMenuOpen ? 'sm:ml-48 ml-20' : 'ml-0'}
      `}>
        {children}
      </main>
    </div>
  );
}