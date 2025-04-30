"use client";
import { useState, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectProvider";

function Projects() {
  const { createProject, projects, isLoading, tasks } = useProject();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });
  //console.log(projects);
  console.log(tasks);

  // This useEffect will handle saving changes to localStorage
  /*
  useEffect(() => {
    // Only save if projects state is not the initial empty array during loading
    if (!isLoading && projects.length >= 0) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects, isLoading]);
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProject(newProject);
    } catch (err) {
      console.error("Error create project", err.message);
    }

    // Reset form and close modal
    setNewProject({
      name: "",
      description: "",
    });
    setIsModalOpen(false);
  };

  const handleViewProject = (projectId) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      {/* Header Section - Made more responsive */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Projects
        </h1>
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Create New Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid - Adjusted grid columns */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-gray-50 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.name}
                  </h3>
                  <span
                    className={`ml-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                    {project.status || "Planning"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description || "No description provided"}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    {project.members && (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1.5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {project.members.length} members
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleViewProject(project.id)}
                  className="w-full bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center border border-gray-200 hover:border-blue-100">
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - Added for better UX */}
      {!isLoading && projects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first project to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects;
