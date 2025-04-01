"use client"

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Sample projects for demonstration
      const sampleProjects = [
        { id: 1, name: 'Website Redesign', status: 'In Progress', deadline: '2024-04-30' },
        { id: 2, name: 'Mobile App Development', status: 'Planning', deadline: '2024-05-15' },
        { id: 3, name: 'Database Migration', status: 'Completed', deadline: '2024-04-10' },
      ];
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
      setProjects(sampleProjects);
    }
  }, []);

  const chartData = {
    labels: projects.map(project => project.name),
    datasets: [
      {
        label: 'Project Status',
        data: projects.map(project => {
          switch (project.status) {
            case 'Completed':
              return 3;
            case 'In Progress':
              return 2;
            case 'Planning':
              return 1;
            default:
              return 0;
          }
        }),
        backgroundColor: projects.map(project => {
          switch (project.status) {
            case 'Completed':
              return 'rgba(34, 197, 94, 0.5)'; // Green
            case 'In Progress':
              return 'rgba(59, 130, 246, 0.5)'; // Blue
            case 'Planning':
              return 'rgba(234, 179, 8, 0.5)'; // Yellow
            default:
              return 'rgba(156, 163, 175, 0.5)'; // Gray
          }
        }),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Manage your projects efficiently and effectively.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Status: <span className={`font-medium ${
                    project.status === 'Completed' ? 'text-green-600' :
                    project.status === 'In Progress' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>{project.status}</span></p>
                  <p className="text-sm text-gray-600">Deadline: <span className="font-medium text-gray-800">{new Date(project.deadline).toLocaleDateString()}</span></p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Status Chart</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-4">Create your first project to get started</p>
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => alert('Create Project functionality coming soon!')}
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}