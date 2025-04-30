"use client";

import { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectProvider";
import { useRouter, useParams } from "next/navigation";

export default function TasksPage() {
  const { getTasksFromProject, tasks, project, isLoading, error } =
    useProject();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.project;
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) {
        setLocalError("No project ID provided");
        setLocalLoading(false);
        return;
      }

      try {
        setLocalLoading(true);
        await getTasksFromProject(projectId);
        setLocalError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setLocalError(err.message);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchTasks();
  }, [getTasksFromProject, projectId]);

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: No project ID provided</p>
      </div>
    );
  }

  if (localLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (localError || error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {localError || error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            className="text-indigo-600 hover:text-indigo-800 mr-4">
            ← Back to Project
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Project Tasks
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description}
                      </p>
                      {task.due_date && (
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span>
                            Due {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        task.priority === "high"
                          ? "text-red-600 bg-red-50"
                          : task.priority === "medium"
                          ? "text-yellow-600 bg-yellow-50"
                          : "text-green-600 bg-green-50"
                      }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No tasks found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No tasks have been created for this project yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
