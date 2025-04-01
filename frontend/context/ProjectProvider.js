import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const api_url = process.env.DJANGO_API || "http://127.0.0.1:8000";

  const getAllProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (newData) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error("Failed to create project");
      const data = await res.json();
      setProjects(prev => [...prev, data]); // optional: update list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProject = async ({ project_id }) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to get project");
      const data = await res.json();
      setProject(data || null);
    } catch (err) {
      setError(err.message);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async ({ project_id, updatedData }) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Failed to update project');
      const data = await res.json();
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async ({ project_id }) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(prev => prev.filter(p => p.id !== project_id));
      setProject(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addTaskToProject = async ({ project_id, taskData }) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(taskData)
      });
      if (!res.ok) throw new Error("Failed to add task to project");
      const data = await res.json();
      setTask(data);
      // Optionally update the project state with new task
      if (project && project.id === project_id) {
        setProject(prev => ({
          ...prev,
          tasks: [...(prev.tasks || []), data]
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        projects,
        isLoading,
        error,
        createProject,
        getAllProjects,
        getProject,
        updateProject,
        deleteProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export default ProjectProvider;
