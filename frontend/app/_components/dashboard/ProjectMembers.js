"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProjectMembers({ members }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <UserCircleIcon className="w-5 h-5 mr-2" />
        Project Members
      </h2>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {member.user.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{member.user}</h3>
                <p className="text-sm text-gray-500">
                  {member.user_email || "No email provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${
                                  member.role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                            `}>
                {member.role}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(member.joined_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
