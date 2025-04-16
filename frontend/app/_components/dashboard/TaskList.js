"use client";

import { useState } from "react";
import {
  ViewListIcon,
  ViewBoardsIcon,
  TableCellsIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function TaskList({ tasks = [] }) {
  const [viewType, setViewType] = useState("list"); // 'list', 'board', or 'table'

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

  const renderListView = () => (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
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
      todo: tasks.filter((t) => t.status === "todo"),
      in_progress: tasks.filter((t) => t.status === "in_progress"),
      done: tasks.filter((t) => t.status === "done"),
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4 capitalize">
              {status.replace("_", " ")}
            </h3>
            <div className="space-y-3">
              {statusTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow p-3">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mt-2">
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
          </div>
        ))}
      </div>
    );
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType("list")}
            className={`p-2 rounded-md ${
              viewType === "list"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-400 hover:text-gray-500"
            }`}>
            <ViewListIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType("board")}
            className={`p-2 rounded-md ${
              viewType === "board"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-400 hover:text-gray-500"
            }`}>
            <ViewBoardsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType("table")}
            className={`p-2 rounded-md ${
              viewType === "table"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-400 hover:text-gray-500"
            }`}>
            <TableCellsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div>
          {viewType === "list" && renderListView()}
          {viewType === "board" && renderBoardView()}
          {viewType === "table" && renderTableView()}
        </div>
      )}
    </div>
  );
}
