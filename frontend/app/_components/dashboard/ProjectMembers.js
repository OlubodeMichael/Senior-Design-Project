"use client";

import { useState, useEffect } from "react";
import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ProjectMembers({
  projectId,
  initialMembers = [],
  currentUserEmail,
}) {
  const [members, setMembers] = useState(() => {
    // Initialize state from localStorage or initial members
    if (typeof window !== "undefined") {
      const storedMembers = localStorage.getItem(
        `project_${projectId}_members`
      );
      if (storedMembers) {
        return JSON.parse(storedMembers);
      }
    }
    if (initialMembers.length > 0) {
      return initialMembers;
    }
    if (currentUserEmail) {
      const currentUser = {
        email: currentUserEmail,
        name: currentUserEmail.split("@")[0],
        isCurrentUser: true,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `project_${projectId}_members`,
          JSON.stringify([currentUser])
        );
      }
      return [currentUser];
    }
    return [];
  });

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    setError("");

    if (!newMemberEmail.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(newMemberEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (members.some((member) => member.email === newMemberEmail)) {
      setError("This member is already added");
      return;
    }

    setIsLoading(true);
    try {
      const newMember = {
        email: newMemberEmail.trim(),
        name: newMemberEmail.split("@")[0],
        isCurrentUser: false,
      };
      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
      localStorage.setItem(
        `project_${projectId}_members`,
        JSON.stringify(updatedMembers)
      );
      setNewMemberEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
      setError("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    if (memberToRemove.isCurrentUser) {
      setError("Cannot remove yourself from the project");
      return;
    }

    setIsLoading(true);
    try {
      const updatedMembers = members.filter(
        (member) => member.email !== memberToRemove.email
      );
      setMembers(updatedMembers);
      localStorage.setItem(
        `project_${projectId}_members`,
        JSON.stringify(updatedMembers)
      );
    } catch (error) {
      console.error("Error removing member:", error);
      setError("Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <UserGroupIcon className="h-5 w-5 text-gray-500" />
        <h4 className="text-sm font-medium text-gray-700">Project Members</h4>
      </div>

      <form onSubmit={handleAddMember} className="mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Add member email..."
              className="flex-1 px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>

      <div className="space-y-2">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">No members added yet</p>
        ) : (
          members.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                  {member.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-500">{member.email}</span>
                </div>
              </div>
              {!member.isCurrentUser && (
                <button
                  onClick={() => handleRemoveMember(member)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
