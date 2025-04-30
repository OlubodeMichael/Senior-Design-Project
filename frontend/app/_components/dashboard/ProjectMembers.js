"use client";

import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function ProjectMembers({ members }) {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <div className="p-2">
        <div className="space-y-1">
          {members && members.length > 0 ? (
            members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-100 transition-colors rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-xs">
                      {member.user
                        ? member.user.charAt(0).toUpperCase()
                        : member.first_name
                        ? member.first_name.charAt(0).toUpperCase()
                        : member.user_email
                        ? member.user_email.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-gray-900 truncate max-w-[100px]">
                      {member.user_email === "superuser@email.com"
                        ? "Super User"
                        : member.first_name && member.last_name
                        ? `${member.first_name} ${member.last_name}`
                        : member.user || member.user_email || "Unknown User"}
                    </h3>
                    <div className="flex items-center text-[10px] text-gray-500">
                      <span className="truncate max-w-[100px]">
                        {member.user_email || "No email"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`
                      px-1.5 py-0.5 rounded-full text-[10px] font-medium
                      ${
                        member.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-indigo-100 text-indigo-700"
                      }
                    `}>
                    {member.role || "Member"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-gray-500">No members</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
