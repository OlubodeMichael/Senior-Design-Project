"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useProject } from "@/context/ProjectProvider";
import { ArrowRightOnRectangleIcon as LogoutIcon } from "@heroicons/react/24/outline";

function SideMenu({ isOpen }) {
  const { project } = useProject();
  const userName = project?.owner?.first_name; //+ " " + project?.owner?.last_name;
  const email = project?.owner?.email;
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    //await logout()
    router.push("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "My Tasks List",
      href: "/dashboard/tasks",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Side Menu */}
      <div
        className={`
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                transform transition-transform duration-300 ease-in-out 
                fixed inset-y-0 left-0
                xs:w-16 sm:w-48 w-20 h-screen bg-white border-r border-gray-200 
                flex flex-col z-40 shadow-md
            `}>
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-center sm:justify-start">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
              <span className="sm:block hidden">CollabFlow</span>
              <span className="sm:hidden block">CF</span>
            </span>
          </Link>
        </div>

        {/* Navigation Section - Updated active item detection */}
        <nav className="flex-1 px-2 sm:px-4 space-y-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            // Improved active state detection
            let isActive = false;

            // Exact match for dashboard home
            if (item.href === "/dashboard" && pathname === "/dashboard") {
              isActive = true;
            }
            // For other routes, check if current path matches or starts with item path
            // but exclude other items that might have overlapping paths
            else if (item.href !== "/dashboard") {
              const pathSegments = pathname.split("/").filter(Boolean);
              const itemSegments = item.href.split("/").filter(Boolean);

              // Check if the current path exactly matches the item path
              // or if it's a subpage (like /dashboard/projects/1 should highlight "Projects")
              if (pathSegments.length >= itemSegments.length) {
                // Check if all segments of the item path match the beginning of the current path
                const allSegmentsMatch = itemSegments.every(
                  (segment, index) => segment === pathSegments[index]
                );

                isActive = allSegmentsMatch;
              }
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 
                                    ${
                                      isActive
                                        ? "bg-blue-50 text-blue-600  border-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                                    }`}
                title={item.name}>
                <span
                  className={`flex-shrink-0 w-5 h-5 ${
                    isActive ? "text-blue-600" : ""
                  }`}>
                  {item.icon}
                </span>
                <span className="ml-3 hidden sm:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/dashboard/settings" className="block mb-4 group">
            <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-4 px-3 py-2 rounded-lg group-hover:bg-gray-50 transition-colors duration-150">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0 mt-2 sm:mt-0 text-center sm:text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {email}
                </p>
                <p className="text-xs text-gray-500 truncate">{userName}</p>
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="group flex items-center justify-center sm:justify-start w-full px-3 sm:px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-150"
            title="Logout">
            <LogoutIcon className="flex-shrink-0 h-5 w-5 text-red-500 group-hover:text-red-600" />
            <span className="ml-3 hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
