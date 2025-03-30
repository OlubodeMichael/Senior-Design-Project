import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

function ProjectProvider() {
    

}


export const useProject = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export default ProjectProvider;