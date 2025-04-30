"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
  projectId,
}) {
  const [editedTask, setEditedTask] = useState(task);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        project: projectId,
      });
    }
  }, [task, projectId]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...editedTask,
      project: projectId,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-30"
          onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Task" : "Task Details"}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-700 rounded-md">
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editedTask.title}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-grey-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-grey-800"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editedTask.status}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-grey-800">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={editedTask.priority}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-grey-800">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editedTask.due_date || ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, due_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-grey-800"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="mt-1 text-gray-900">{task.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Description
                </h4>
                <p className="mt-1 text-gray-900">{task.description}</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1 capitalize text-gray-900">
                    {task.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Priority
                  </h4>
                  <p className="mt-1 capitalize text-gray-900">
                    {task.priority}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                <p className="mt-1 text-gray-900">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "No due date set"}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
