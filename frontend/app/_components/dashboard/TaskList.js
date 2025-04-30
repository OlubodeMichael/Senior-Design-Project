"use client";

import { useState, useEffect } from "react";
import {
  Bars4Icon,
  ViewColumnsIcon,
  TableCellsIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import TaskDetailModal from "./TaskDetailModal";
import { useProject } from "@/context/ProjectProvider";

export default function TaskList({ tasks = [], projectId }) {
  const [viewType, setViewType] = useState("board"); // 'list', 'board', or 'table'
  const [selectedTask, setSelectedTask] = useState(null);
  const { updateTask, deleteTask, getProject, isLoading } = useProject();

  // Add loading indicator for task operations
  const [isTaskOperationLoading, setIsTaskOperationLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "todo":
        return <ExclamationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      setError(null);
      setIsTaskOperationLoading(true);
      await updateTask({
        project_id: projectId,
        task_id: updatedTask.id,
        updatedTask: {
          ...updatedTask,
          project: projectId,
        },
      });
      await getProject(projectId);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setIsTaskOperationLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError(null);
      setIsTaskOperationLoading(true);
      await deleteTask({
        project_id: projectId,
        task_id: taskId,
      });
      await getProject(projectId);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setIsTaskOperationLoading(false);
    }
  };

  const renderListView = () => (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <div
          key={task.id}
          onClick={() => handleTaskClick(task)}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-1">{getStatusIcon(task.status)}</div>
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}>
              {task.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBoardView = () => {
    const columns = {
      todo: tasks?.filter((t) => t.status === "todo"),
      in_progress: tasks?.filter((t) => t.status === "in_progress"),
      done: tasks?.filter((t) => t.status === "done"),
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4 capitalize flex items-center">
              {getStatusIcon({ status })}
              <span className="ml-2">{status.replace("_", " ")}</span>
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {statusTasks?.length}
              </span>
            </h3>
            <div className="space-y-3">
              {statusTasks?.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="bg-white rounded-lg shadow p-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        task.priority
                      )}`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-500">
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {statusTasks?.length === 0 && (
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-4 text-center">
                  <p className="text-sm text-gray-500">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks?.map((task) => (
            <tr
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(task.status)}
                  <span className="ml-2 text-sm text-gray-900 capitalize">
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {task.title}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 line-clamp-2">
                  {task.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType("list")}
            className={`p-2 rounded-md ${
              viewType === "list"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-500"
            }`}>
            <Bars4Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType("board")}
            className={`p-2 rounded-md ${
              viewType === "board"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-500"
            }`}>
            <ViewColumnsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType("table")}
            className={`p-2 rounded-md ${
              viewType === "table"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-500"
            }`}>
            <TableCellsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {tasks?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">
            No tasks yet. Create your first task!
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div>
          {viewType === "list" && renderListView()}
          {viewType === "board" && renderBoardView()}
          {viewType === "table" && renderTableView()}
        </div>
      )}

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        projectId={projectId}
        isLoading={isTaskOperationLoading}
      />
    </div>
  );
}
