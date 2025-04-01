"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Project() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Wrap localStorage operations in try-catch for SSR safety
        try {
            // Check if params.project exists
            if (!params?.project) {
                setError('Invalid project ID');
                setIsLoading(false);
                return;
            }

            // Load project from localStorage
            const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
            
            // Seed initial data if localStorage is empty
            if (savedProjects.length === 0) {
                const initialProjects = [
                    { id: 1, name: 'Website Redesign', status: 'In Progress', deadline: '2024-04-30' },
                    { id: 2, name: 'Mobile App Development', status: 'Planning', deadline: '2024-05-15' },
                    { id: 3, name: 'Database Migration', status: 'Completed', deadline: '2024-04-10' },
                ];
                localStorage.setItem('projects', JSON.stringify(initialProjects));
            }

            // Find project by ID (using Number to handle string IDs)
            const projectId = Number(params.project);
            const foundProject = savedProjects.find(p => p.id === projectId);
            
            if (foundProject) {
                setProject(foundProject);
                // Create a deep clone of the project for editing
                setEditedProject(JSON.parse(JSON.stringify(foundProject)));
                setError(null);
            } else {
                setError('Project not found');
            }
        } catch (err) {
            setError('Error loading project');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [params?.project]); // Only depend on params.project

    const handleDelete = () => {
        try {
            if (confirm('Are you sure you want to delete this project?')) {
                const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
                const updatedProjects = savedProjects.filter(p => p.id !== project.id);
                localStorage.setItem('projects', JSON.stringify(updatedProjects));
                router.push('/dashboard/projects');
            }
        } catch (err) {
            setError('Error deleting project');
            console.error('Error:', err);
        }
    };

    const handleSave = () => {
        try {
            const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
            const updatedProjects = savedProjects.map(p => 
                p.id === project.id ? {...editedProject} : p
            );
            
            // Verify the save operation
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            const verified = JSON.parse(localStorage.getItem('projects'));
            
            if (JSON.stringify(verified) === JSON.stringify(updatedProjects)) {
                setProject({...editedProject}); // Use spread to create new reference
                setIsEditing(false);
                setError(null);
            } else {
                throw new Error('Save verification failed');
            }
        } catch (err) {
            setError('Error saving project');
            console.error('Error:', err);
        }
    };

    const handleCancel = () => {
        // Reset editedProject to a deep clone of the original project
        setEditedProject(JSON.parse(JSON.stringify(project)));
        setIsEditing(false);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Show error state
    if (error || !project) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {error || 'Project not found'}
                    </h3>
                    <button
                        onClick={() => router.push('/dashboard/projects')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Return to projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            {/* Header with improved spacing and visual hierarchy */}
            <div className="max-w-5xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/dashboard/projects')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Back to Projects</span>
                </button>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white rounded-lg shadow-sm p-6">
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedProject.name}
                                onChange={(e) => setEditedProject({
                                    ...editedProject,
                                    name: e.target.value
                                })}
                                className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none pb-1 w-full"
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
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
                                >
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                >
                                    <span>Save Changes</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Details Card */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span>Project Details</span>
                                    {!isEditing && (
                                        <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                                            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {project.status}
                                        </span>
                                    )}
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
                                                    onChange={(e) => setEditedProject({
                                                        ...editedProject,
                                                        status: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                    value={editedProject.deadline}
                                                    onChange={(e) => setEditedProject({
                                                        ...editedProject,
                                                        deadline: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">Deadline</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {new Date(project.deadline).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="lg:border-l lg:pl-6">
                            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">Project Timeline</h4>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-gray-600">Created on </span>
                                    <span className="ml-1 text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-gray-600">Last updated </span>
                                    <span className="ml-1 text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}