import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Divider,
  EmptyState,
  Form,
  FormLayout,
  InlineStack,
  Scrollable,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import SelectField from "./SelectField";

import { useFormContext } from "../context/FormContext";
import { useFieldCombineContext } from "../context/FieldCombineContext";
const FormFields = ({
  fileFields,
  handleDownload,
  saveLoading,
  orderData = [],
  handleSave,
}) => {
  const { formFields, fieldsLoaded, fieldsLoadedEnd, addField, addAllFields } =
    useFormContext();

  const { fieldCombine } = useFieldCombineContext();
  const initialForm = useRef(false);

  useEffect(() => {
    if (!fieldsLoaded && !initialForm.current) {
      initialForm.current = true;
      if (orderData.length > 0) {
        addAllFields(orderData);
      }
      fieldsLoadedEnd(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsLoaded, orderData]);
  const selectList = useMemo(() => {
    if (!fileFields.length) return [{ value: "", label: "" }];
    let combineFields = fieldCombine.map((field) => {
      return `${field.firstField} ${field.operator} ${field.secondField}`;
    });
    return [...fileFields, ...combineFields].map((field) => {
      return { value: field, label: field };
    });
  }, [fileFields, fieldCombine]);
  const handleSubmit = useCallback((e) => {}, []);
  const handleAddField = useCallback(() => {
    debugger;
    addField({
      newField: "New Field",
      oldField: "null",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        {fieldsLoaded && formFields.length > 0 ? (
          <Scrollable style={{ maxHeight: "400px" }}>
            <BlockStack gap="500">
              {formFields.map((field) => {
                return (
                  <React.Fragment key={field.id}>
                    <SelectField field={field} selectList={selectList} />
                    <Divider borderColor="border" />
                  </React.Fragment>
                );
              })}
            </BlockStack>
          </Scrollable>
        ) : (
          <Card>
            <EmptyState
              heading="There Is No Field, Please Click Add Field."
              action={{
                content: "Add Field",
                onAction: () => handleAddField(),
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            />
          </Card>
        )}

        <InlineStack blockAlign="center" align="space-between">
          {formFields.length ? (
            <Button onClick={() => handleAddField()}>Add Field</Button>
          ) : (
            <div></div>
          )}

          <ButtonGroup>
            <Button onClick={handleDownload}>Download</Button>
            <Button
              loading={saveLoading}
              onClick={handleSave}
              variant="primary"
            >
              Save
            </Button>
          </ButtonGroup>
        </InlineStack>
      </FormLayout>
    </Form>
  );
};

export default FormFields;
