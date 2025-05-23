"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(null);
  const api_url =
    "https://collabflow-xzeb.onrender.com" || "http://localhost:8000";

  useEffect(() => {
    const fetchProjects = async () => {
      await getAllProjects();
    };
    fetchProjects();
  }, []);

  const getAllProjects = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
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
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newProject),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const data = await res.json();
      setProjects((prev) => [...prev, data]); // optional: update list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProject = async (project_id) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update project");
      const data = await res.json();
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (project_id) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== project_id));
      setProject(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addTaskToProject = async ({ project_id, taskData }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error("Failed to add task to project");
      const data = await res.json();
      setTask(data);
      // Optionally update the project state with new task
      if (project && project.id === project_id) {
        setProject((prev) => ({
          ...prev,
          tasks: [...(prev.tasks || []), data],
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksFromProject = async (project_id) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`${api_url}/api/projects/${project_id}/tasks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      //if (!res.ok) throw new Error("Failed to fetch task to this project");

      const data = await res.json();
      setTasks(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTasks = async () => {
    setError(null);
    try {
      setIsLoading(true);
      // First get all projects
      const projectsRes = await fetch(`${api_url}/api/projects/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!projectsRes.ok) throw new Error("Failed to fetch projects");
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      // Then get tasks for each project
      const allTasks = [];
      for (const project of projectsData) {
        try {
          const tasksRes = await fetch(
            `${api_url}/api/projects/${project.id}/tasks/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          if (tasksRes.ok) {
            const projectTasks = await tasksRes.json();
            allTasks.push(...projectTasks);
          }
        } catch (err) {
          console.error(`Error fetching tasks for project ${project.id}:`, err);
          // Continue with other projects even if one fails
        }
      }

      setTasks(allTasks);
      return allTasks;
    } catch (err) {
      setError(err.message);
      setTasks([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskFromProject = async ({ project_id, task_id }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${api_url}/api/projects/${project_id}/tasks/${task_id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to add task to this project");

      const data = await res.json();
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async ({ project_id, task_id, updatedTask }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${api_url}/api/projects/${project_id}/tasks/${task_id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedTask),
        }
      );

      if (!res.ok) throw new Error("Failed to update task in this project");

      const data = await res.json();
      setTask(data);

      setTasks((prev) => prev?.map((t) => (t.id === data.id ? data : t)));

      // Optionally update single project if task exists within it
      if (project && project.tasks) {
        setProject((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === data.id ? data : t)),
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async ({ project_id, task_id }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${api_url}/api/projects/${project_id}/tasks/${task_id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete task");

      // Update local state
      if (project && project.tasks) {
        setProject((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== task_id),
        }));
      }
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskComments = async ({ project_id, task_id }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${api_url}/api/projects/${project_id}/tasks/${task_id}/comments/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to get task comments");

      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addCommentToTask = async ({ project_id, task_id, commentData }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${api_url}/api/projects/${project_id}/tasks/${task_id}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment to task");

      const data = await res.json();
      setComments((prev) => [...prev, data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async ({ project_id, task_id, comment_id }) => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${api_url}/api/projects/${project_id}/tasks/${task_id}/comments/${comment_id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((c) => c.id !== comment_id));
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
        comments,
        comment,
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
        updateTask,
        deleteTask,
        getAllTasks,
        getTaskComments,
        addCommentToTask,
        deleteComment,
      }}>
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
