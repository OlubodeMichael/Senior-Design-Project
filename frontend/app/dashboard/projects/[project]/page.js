"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useProject } from "@/context/ProjectProvider";
import ProjectMembers from "@/app/_components/dashboard/ProjectMembers";
import TaskModal from "@/app/_components/dashboard/TaskModal";
import TaskList from "@/app/_components/dashboard/TaskList";

export default function Project({ params }) {
  const {
    project,
    isLoading,
    getProject,
    deleteProject,
    tasks,
    addTaskToProject,
    getTasksFromProject,
    updateProject,
  } = useProject();
  const resolvedParams = use(params);
  const projectId = resolvedParams.project;
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    const fetchOnLoad = async () => {
      await getProject(projectId);
      await getTasksFromProject(projectId);
    };

    fetchOnLoad();
  }, [projectId]);

  useEffect(() => {
    if (project) {
      setEditedProject(project);
    }
  }, [project]);

  const handleDelete = async () => {
    try {
      await deleteProject(projectId);
      router.push("/dashboard/projects");
    } catch (err) {
      setError("Error deleting project");
      console.error("Error:", err);
    }
  };

  const handleSave = async () => {
    try {
      await updateProject({
        project_id: projectId,
        updatedData: editedProject,
      });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Error saving project");
      console.error("Error:", err);
    }
  };

  const handleCancel = () => {
    setEditedProject(project);
    setIsEditing(false);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await addTaskToProject({
        project_id: projectId,
        taskData: {
          ...taskData,
          project: projectId,
        },
      });
      await getProject(projectId);
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto text-center py-16 bg-white rounded-xl shadow-sm p-8">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {error || "Project not found"}
          </h3>
          <p className="text-gray-500 mb-6">
            We couldn't find the project you're looking for.
          </p>
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
            Return to projects
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Planning":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header with improved spacing and visual hierarchy */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedProject.name}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    name: e.target.value,
                  })
                }
                className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none pb-1 w-full"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {project.name}
              </h1>
            )}
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center">
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                project.status
              )}`}>
              {project.status}
            </span>
            {project.deadline && (
              <div className="flex items-center text-gray-500 text-sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>
                  Due {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center">
            <span className="mr-2">+</span>
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span>Project Details</span>
                </h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editedProject.status}
                          onChange={(e) =>
                            setEditedProject({
                              ...editedProject,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={editedProject.deadline}
                          onChange={(e) =>
                            setEditedProject({
                              ...editedProject,
                              deadline: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editedProject.description}
                          onChange={(e) =>
                            setEditedProject({
                              ...editedProject,
                              description: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-base text-gray-900">
                        {project.description || "No description provided"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:border-l lg:pl-6">
              <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4 flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                Project Timeline
              </h4>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-600">Created on </span>
                  <span className="ml-1 text-gray-900 font-medium">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-gray-600">Last updated </span>
                  <span className="ml-1 text-gray-900 font-medium">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </div>
                {project.deadline && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-gray-600">Deadline </span>
                    <span className="ml-1 text-gray-900 font-medium">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4 flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Team Members
                </h4>
                <div className="flex -space-x-2 overflow-hidden">
                  {project.members &&
                    project.members.slice(0, 5).map((member, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {member.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                  {project.members && project.members.length > 5 && (
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-gray-100">
                      <span className="text-xs font-medium text-gray-600">
                        +{project.members.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <ProjectMembers members={project.members} />
      </div>

      {/* Tasks Section */}
      <div className="max-w-6xl mx-auto">
        <TaskList tasks={tasks} projectId={projectId} />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projectId={projectId}
      />
    </div>
  );
}
