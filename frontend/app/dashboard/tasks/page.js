"use client";

import { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectProvider";
import TaskList from "@/app/_components/dashboard/TaskList";

export default function TasksPage() {
  const { getAllTasks, tasks, isLoading, error } = useProject();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isInitialLoad) return;

      try {
        await getAllTasks();
        setIsInitialLoad(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setIsInitialLoad(false);
      }
    };

    fetchTasks();
  }, [getAllTasks, isInitialLoad]);

  if (isLoading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Tasks</h1>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
