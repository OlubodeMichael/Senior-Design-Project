"use client"
import { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useProject } from '@/context/ProjectProvider';

function Projects() {
    const { createProject, projects, isLoading } = useProject()
    const router = useRouter();
    //const [projects, setProjects] = useState([]);
   // const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: ''
    });

    const sampleProjects = [
        { id: 1, name: 'Website Redesign', status: 'In Progress', deadline: '2024-04-30', tasks: [] },
        { id: 2, name: 'Mobile App Development', status: 'Planning', deadline: '2024-05-15', tasks: [] },
        { id: 3, name: 'Database Migration', status: 'Completed', deadline: '2024-04-10', tasks: [] },
    ];

    /*
    useEffect(() => {
        try {
            const saved = localStorage.getItem('projects');
            
            if (saved) {
                // If projects exist in localStorage, use them
                const parsed = JSON.parse(saved);
                // Ensure tasks array exists for older projects
                const projectsWithTasks = parsed.map(p => ({ ...p, tasks: p.tasks || [] }));
                if (Array.isArray(projectsWithTasks)) {
                    setProjects(projectsWithTasks);
                } else {
                    console.warn("Invalid data in localStorage");
                    setProjects([]); // Reset to empty array if invalid
                }
            } else {
                // Only set sample projects if localStorage is completely empty
                localStorage.setItem('projects', JSON.stringify(sampleProjects));
                setProjects(sampleProjects);
            }
        } catch (err) {
            console.error("Error reading localStorage:", err);
            setProjects([]); // Reset on error
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array - only run once on mount
*/
    // This useEffect will handle saving changes to localStorage
    useEffect(() => {
        // Only save if projects state is not the initial empty array during loading
        if (!isLoading && projects.length >= 0) {
            localStorage.setItem('projects', JSON.stringify(projects));
        }
    }, [projects, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await createProject(newProject)
        } catch(err){
            console.error("Error create project", err.message)
        }
        
        
        // Reset form and close modal
        setNewProject({
            name: '',
        description: ''
        });
        setIsModalOpen(false);
    };

    const handleViewProject = (projectId) => {
        router.push(`/dashboard/projects/${projectId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            {/* Header Section - Made more responsive */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h1>
                <button
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
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
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Project</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
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
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
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
                            className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                {project.name}
                            </h3>
                            <div className="flex flex-col space-y-2">
                               
                                <button
                                    className="mt-4 w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base"
                                    onClick={() => handleViewProject(project.id)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State - Added for better UX */}
            {!isLoading && projects.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Create your first project to get started</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Project
                    </button>
                </div>
            )}
        </div>
    );
}

export default Projects;