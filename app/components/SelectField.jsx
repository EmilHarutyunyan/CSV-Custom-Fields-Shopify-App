import {
  Button,
  Divider,
  InlineStack,
  Select,
  TextField,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "../context/FormContext";
import { DeleteIcon } from "@shopify/polaris-icons";

const SelectField = ({ field, selectList }) => {
  const { changeField,removeField } = useFormContext();
  const [selected, setSelected] = useState(field.oldField || "");
  const [value, setValue] = useState(field.newField || "");
  // useEffect(()=> {
  //   addField(field)
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[field])
  const handleChange = useCallback((newValue) => {
    changeField(field.id, { newField: newValue });
    setValue(newValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelectChange = useCallback((value) => {
    setSelected(value);
    changeField(field.id, { oldField: value });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteField = useCallback((field) => {
    removeField(field.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <InlineStack gap={"400"} align="start" blockAlign="end">
      <div style={{ width: "45%" }}>
        <TextField
          label="New Field"
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div style={{ width: "45%" }}>
        <Select
          label="File Fields"
          options={selectList}
          onChange={handleSelectChange}
          value={selected}
        />
      </div>
      <div style={{ width: "5%" }}>
      <Button  tone="critical" onClick={()=>handleDeleteField(field)} icon={DeleteIcon}></Button>

      </div>
    </InlineStack>
  );
};

export default SelectField;
