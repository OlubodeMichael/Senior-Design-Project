"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import SideMenu from "@/app/_components/dashboard/SideMenu";
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    // Check if mobile on initial render
    setIsMobile(window.innerWidth < 640);

    // Handle resize events
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      // Auto-close menu on very small screens
      if (mobile && window.innerWidth < 480) {
        setIsSideMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50 flex relative">
      {/* Toggle Button - Enhanced for better mobile experience */}
      <button
        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
        className={`
          fixed top-4 left-4 z-50
          p-2 rounded-md shadow-sm bg-white border border-gray-200 
          text-gray-600 hover:bg-gray-50
          transition-all duration-300 ease-in-out
          sm:top-1/2 sm:-translate-y-1/2
          ${isSideMenuOpen ? 'sm:left-48 left-20 md:opacity-50 hover:opacity-100' : 'left-4'}
        `}
        aria-label={isSideMenuOpen ? "Close menu" : "Open menu"}
      >
        {isSideMenuOpen ? (
          <XIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Overlay for mobile - closes menu when clicked outside */}
      {isSideMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30"
          onClick={() => setIsSideMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <SideMenu isOpen={isSideMenuOpen} />
      <main className={`
        flex-1 transition-all duration-300 ease-in-out 
        ${isSideMenuOpen ? 'sm:ml-48 ml-20' : 'ml-0'} 
        pt-16 sm:pt-0 px-4 sm:px-6 md:px-8
      `}>
        {children}
      </main>
    </div>
  );
}