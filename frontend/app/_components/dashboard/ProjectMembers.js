"use client";

import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function ProjectMembers({ members }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-900">
          <UserCircleIcon className="w-5 h-5 mr-2 text-indigo-600" />
          Project Members
        </h2>

        <div className="space-y-4">
          {members && members.length > 0 ? (
            members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-lg">
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
                    <h3 className="font-medium text-gray-900">
                      {member.user_email === "superuser@email.com"
                        ? "Super User"
                        : member.first_name && member.last_name
                        ? `${member.first_name} ${member.last_name}`
                        : member.user || member.user_email || "Unknown User"}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      <span>{member.user_email || "No email provided"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${
                        member.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-indigo-100 text-indigo-700"
                      }
                    `}>
                    {member.role || "Member"}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>
                      Joined{" "}
                      {member.joined_at
                        ? new Date(member.joined_at).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                No members added to this project yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
