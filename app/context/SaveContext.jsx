import { createContext, useContext, useState } from "react";

const SaveContext = createContext();


export function useSaveContext() {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error("useSaveContext must be used within a SaveProvider");
  }
  return context;
}


export function SaveProvider({ children }) {
  const [isSave, setIsSave] = useState(false);

  const changeIsSave = () => {
    setIsSave(true);
  };

  const resetIsSave = () => {
    setIsSave(false)
  };


  return (
    <SaveContext.Provider value={{ isSave, changeIsSave, resetIsSave }}>
      {children}
    </SaveContext.Provider>
  );
}