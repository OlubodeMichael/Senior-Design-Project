"use client"
import { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

function Projects() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        status: 'Planning',
        deadline: ''
    });

    const sampleProjects = [
        { id: 1, name: 'Website Redesign', status: 'In Progress', deadline: '2024-04-30' },
        { id: 2, name: 'Mobile App Development', status: 'Planning', deadline: '2024-05-15' },
        { id: 3, name: 'Database Migration', status: 'Completed', deadline: '2024-04-10' },
    ];

    useEffect(() => {
        try {
            const saved = localStorage.getItem('projects');
            
            if (saved) {
                // If projects exist in localStorage, use them
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setProjects(parsed);
                } else {
                    console.warn("Invalid data in localStorage");
                    setProjects([]);
                }
            } else {
                // Only set sample projects if localStorage is completely empty
                localStorage.setItem('projects', JSON.stringify(sampleProjects));
                setProjects(sampleProjects);
            }
        } catch (err) {
            console.error("Error reading localStorage:", err);
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array - only run once on mount

    // This useEffect will handle saving changes to localStorage
    useEffect(() => {
        if (projects.length > 0) {  // Only save if there are projects
            localStorage.setItem('projects', JSON.stringify(projects));
        }
    }, [projects]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        
        setProjects([...projects, {
            id: newId,
            ...newProject
        }]);
        
        // Reset form and close modal
        setNewProject({
            name: '',
            status: 'Planning',
            deadline: ''
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
                                    Status
                                </label>
                                <select
                                    value={newProject.status}
                                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                >
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
                                    required
                                    value={newProject.deadline}
                                    onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
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
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Deadline:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Date(project.deadline).toLocaleDateString()}
                                    </span>
                                </div>
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