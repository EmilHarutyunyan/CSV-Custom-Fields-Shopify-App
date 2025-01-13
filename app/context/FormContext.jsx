import { createContext, useContext, useState } from "react";
import { getRandomId } from "../utils/utils";
import { useSaveContext } from "./SaveContext";

const FormContext = createContext();

const initial = [
  {
    newField:"",
    oldField:"",
    id: Math.random(),
  }
]

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

export function FormProvider({ children }) {
  const {changeIsSave} = useSaveContext();
  const [formFields, setFormFields] = useState([]);
  const [fieldsLoaded,setFieldsLoaded] = useState(false);

  const addAllFields = (allFields) => {
    setFormFields(allFields);
  }

  const addField = (field) => {
    setFormFields((prevFields) => [...prevFields, { ...field, id: getRandomId() }]);
    changeIsSave()
  };


  const changeField = (id, updatedField) => {
    
    setFormFields((prevFields) =>
      prevFields.map((field) => {
        
        if(id === field.id)  {
          return { ...field, ...updatedField }
        }
        return field;
      
      })
    );
    changeIsSave()
  };

  const removeField = (id) => {
    setFormFields((prevFields) => prevFields.filter((field) => field.id !== id));
    changeIsSave()
  };

  const fieldsLoadedEnd = (loaded) => {
    setFieldsLoaded(loaded)
  };

  const clearFields = () => {
    setFormFields([]);
    setFieldsLoaded(false)
  };

  return (
    <FormContext.Provider
      value={{
        formFields,
        addField,
        changeField,
        fieldsLoaded,
        removeField,
        clearFields,
        fieldsLoadedEnd,
        addAllFields
      }}
    >
      {children}
    </FormContext.Provider>
  );
}