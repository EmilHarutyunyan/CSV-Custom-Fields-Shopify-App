import { createContext, useContext, useState } from "react";
import { getRandomId } from "../utils/utils";
import { useSaveContext } from "./SaveContext";

const FieldCombineContext = createContext();

const initial = [
  {
    firstField:"",
    operator:"",
    secondField:"",
    id: Math.random(),
  }
]

export function useFieldCombineContext() {
  const context = useContext(FieldCombineContext);
  if (!context) {
    throw new Error("useFieldCombineContext must be used within a FormProvider");
  }
  return context;
}

export function FieldCombineProvider({ children }) {
  const [fieldCombine, setFieldCombine] = useState([]);
  const [fieldCombineLoaded,setFieldCombineLoaded] = useState(false);
  const {changeIsSave} = useSaveContext();

  const addInitialFieldCombine = (fields) => {
    setFieldCombine(fields);
  };
  const addFieldCombine = (field) => {
    setFieldCombine((prevFields) => [...prevFields, { ...field, id: getRandomId() }]);
    changeIsSave();
  };


  const changeFieldCombine = (id, updatedField) => {
    
    setFieldCombine((prevFields) =>
      prevFields.map((field) => {
        
        if(id === field.id)  {
          return { ...field, ...updatedField }
        }
        return field;
      
      })
    );
    changeIsSave();
  };

  const removeFieldCombine = (id) => {
    debugger
    setFieldCombine((prevFields) => prevFields.filter((field) => field.id !== id));
    changeIsSave();
  };

  const fieldCombineLoadedEnd = (loaded) => {
    setFieldCombineLoaded(loaded)
  };

  const clearFieldCombine = () => {
    setFieldCombine([]);
    setFieldCombineLoaded(false)
  };

  return (
    <FieldCombineContext.Provider
      value={{
        fieldCombine,
        addFieldCombine,
        changeFieldCombine,
        fieldCombineLoaded,
        removeFieldCombine,
        clearFieldCombine,
        fieldCombineLoadedEnd,
        addInitialFieldCombine
      }}
    >
      {children}
    </FieldCombineContext.Provider>
  );
}