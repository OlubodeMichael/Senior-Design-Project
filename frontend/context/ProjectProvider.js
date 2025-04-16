"use client"
import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState(null)
  const [task, setTask] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const api_url = process.env.DJANGO_API || "http://127.0.0.1:8000";

  const getCSRFToken = () => {
    const name = "csrftoken=";
    const cookies = document.cookie.split(";");
  
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length);
      }
    }
    return null;
  }

  useEffect(()=>{
    getAllProjects()
  }, [])

  const getAllProjects = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects`, {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
          },
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

  const createProject = async (newProject) => {
    const csrfToken = getCSRFToken()
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/`, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json' ,
           "X-CSRFToken": csrfToken,
          },
        credentials: 'include',
        body: JSON.stringify(newProject)
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

  const getProject = async (project_id ) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to get project");
      console.log(res)
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
    const csrfToken = getCSRFToken()
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' ,
          "X-CSRFToken": csrfToken,
        },
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

  const deleteProject = async (project_id ) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
    const csrfToken = getCSRFToken()
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken,
        },
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

  const getTasksFromProject = async ({ project_id}) => {
    setError(null);
    try{ 
      setIsLoading(true)
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if(!res.ok) throw new Error("Failed to add task to this project")
      
      const data = await res.json()
      setTasks(data)
    } catch(err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }

  }

  const getTaskFromProject = async ({ project_id, task_id}) => {
    setError(null);
    try{ 
      setIsLoading(true)
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks/${task_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if(!res.ok) throw new Error("Failed to add task to this project")
      
      const data = await res.json()
      setTask(data)
    } catch(err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }

  }

  const updateTask = async ({ project_id, task_id, updatedTask }) => {
    const csrfToken = getCSRFToken();
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks/${task_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(updatedTask), 
      });
  
      if (!res.ok) throw new Error("Failed to update task in this project");
  
      const data = await res.json();
      setTask(data);
  
      setTasks(prev => prev?.map(t => t.id === data.id ? data : t));
  
      // Optionally update single project if task exists within it
      if (project && project.tasks) {
        setProject(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === data.id ? data : t)
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
        task,
        tasks,
        project,
        projects,
        isLoading,
        error,
        createProject,
        getAllProjects,
        getProject,
        updateProject,
        deleteProject,
        addTaskToProject,
        getTasksFromProject,
        getTaskFromProject,
        updateTask
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
