"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useProject } from "@/context/ProjectProvider";
import { useRouter } from "next/navigation";
import ProjectMembers from "@/app/_components/dashboard/ProjectMembers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const { projects, loading, error, getAllProjects, createProject } =
    useProject();
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    upcomingDeadlines: 0,
  });
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  useEffect(() => {
    if (projects) {
      calculateStats(projects);
    }
  }, [projects]);

  useEffect(() => {
    // Get current user's email from localStorage or your auth system
    const userEmail = localStorage.getItem("userEmail") || "user@example.com"; // Replace with actual user email
    setCurrentUserEmail(userEmail);
  }, []);

  const calculateStats = (projectList) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    setStats({
      totalProjects: projectList.length,
      completedProjects: projectList.filter((p) => p.status === "Completed")
        .length,
      inProgressProjects: projectList.filter((p) => p.status === "In Progress")
        .length,
      upcomingDeadlines: projectList.filter((p) => {
        const deadline = new Date(p.deadline);
        return deadline >= today && deadline <= nextWeek;
      }).length,
    });
  };

  const handleCreateProject = () => {
    router.push("/dashboard/projects/new");
  };

  const chartData = {
    labels: projects?.map((project) => project.name) || [],
    datasets: [
      {
        label: "Project Progress",
        data: projects?.map((project) => project.progress || 0) || [],
        backgroundColor:
          projects?.map((project) => {
            switch (project.status) {
              case "Completed":
                return "rgba(34, 197, 94, 0.7)"; // Green
              case "In Progress":
                return "rgba(59, 130, 246, 0.7)"; // Blue
              case "Planning":
                return "rgba(234, 179, 8, 0.7)"; // Yellow
              default:
                return "rgba(156, 163, 175, 0.7)"; // Gray
            }
          }) || [],
        borderColor:
          projects?.map((project) => {
            switch (project.status) {
              case "Completed":
                return "rgb(34, 197, 94)";
              case "In Progress":
                return "rgb(59, 130, 246)";
              case "Planning":
                return "rgb(234, 179, 8)";
              default:
                return "rgb(156, 163, 175)";
            }
          }) || [],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Project Progress Overview",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Progress (%)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <ExclamationCircleIcon className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-900 font-medium">Error loading projects</p>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => getAllProjects()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's an overview of your projects.
            </p>
          </div>
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalProjects}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completedProjects}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.inProgressProjects}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Active Projects
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {projects?.map((project) => (
                  <div
                    key={project.id}
                    className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {project.progress || 0}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            project.status === "Completed"
                              ? "bg-green-500"
                              : project.status === "In Progress"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <ProjectMembers
                        projectId={project.id}
                        initialMembers={project.team || []}
                        currentUserEmail={currentUserEmail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Project Progress
            </h2>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {(!projects || projects.length === 0) && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first project to get started
            </p>
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
