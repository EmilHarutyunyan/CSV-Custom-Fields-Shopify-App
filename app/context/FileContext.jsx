import { createContext, useContext, useState } from "react";

const FileContext = createContext();


export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}


export function FileProvider({ children }) {
  const [files, setFiles] = useState([]);

  const addFile = (file) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <FileContext.Provider value={{ files, addFile, removeFile, clearFiles }}>
      {children}
    </FileContext.Provider>
  );
}