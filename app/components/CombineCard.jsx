import {
  Button,
  Card,
  Form,
  InlineStack,
  Select,
  Tag,
  Text,
} from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldCombineContext } from "../context/FieldCombineContext";
import { operators } from "../constant/constant";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";

const CombineCard = ({ fileFields, fieldCombineData, isDisable = true }) => {
  const [selectedFirst, setSelectedFirst] = useState("");
  const [selectedSecond, setSelectedSecond] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const {
    fieldCombineLoaded,
    fieldCombine,
    addFieldCombine,
    fieldCombineLoadedEnd,
    removeFieldCombine,
    addInitialFieldCombine,
  } = useFieldCombineContext();
  const initialRef = useRef(false);
  const shopify = useAppBridge();
  useEffect(() => {
    if (!fieldCombineLoaded && !initialRef.current) {
      if (fieldCombineData.length > 0) {
        addInitialFieldCombine(fieldCombineData);
      }
      initialRef.current = true;
      fieldCombineLoadedEnd(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectList = useMemo(() => {
    if (!fileFields.length) return [{ value: "", label: "" }];
    let combineFields = fieldCombine.map((field) => {
      return `${field.firstField} ${field.operator} ${field.secondField}`;
    });
    return [...fileFields, ...combineFields].map((field) => {
      return { value: field, label: field };
    });
  }, [fileFields, fieldCombine]);

  const handleSelectFirstChange = useCallback(
    (value) => {
      setSelectedFirst(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFirst],
  );

  const handleSelectSecondChange = useCallback(
    (value) => {
      setSelectedSecond(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSecond],
  );
  const handleSelectOperatorChange = useCallback(
    (value) => {
      setSelectedOperator(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOperator],
  );
  const handleAddCombine = useCallback(() => {
    addFieldCombine({
      firstField: selectedFirst,
      secondField: selectedSecond,
      operator: selectedOperator,
    });
    handleSelectFirstChange("");
    handleSelectSecondChange("");
    handleSelectOperatorChange("");
    shopify.modal.hide("combine-modal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFirst, selectedSecond, selectedOperator]);
  const handleRemoveCombine = useCallback((field) => {
    removeFieldCombine(field.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCombineField = useCallback(() => {
    shopify.modal.show("combine-modal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSave = useCallback(() => {
    if (
      selectedOperator !== "" &&
      selectedOperator !== "" &&
      selectedOperator !== ""
    ) {
      return false;
    }
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFirst, selectedSecond, selectedOperator]);
  return (
    <>
      <Card>
        <Text as="h4" variant="headingMd">
          File Custom Fields
        </Text>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <InlineStack gap="200" style={{ marginTop: "30px" }}>
            {fieldCombine?.map((field, idx) => (
              <Tag onRemove={() => handleRemoveCombine(field)} key={field.id}>
                {field.firstField} {field.operator} {field.secondField}
              </Tag>
            ))}
            <Button
              onClick={handleCombineField}
              icon={PlusCircleIcon}
              variant="primary"
              disabled={!isDisable}
            >
              Add Combine Field
            </Button>
          </InlineStack>
        </div>
      </Card>
      <Modal id="combine-modal">
        <Form>
          <div style={{ margin: "10px" }}>
            <Card>
              <InlineStack gap={"400"} align="start" blockAlign="end">
                <div style={{ flex: "1" }}>
                  <Select
                    label="Fields"
                    options={selectList}
                    onChange={handleSelectFirstChange}
                    value={selectedFirst}
                  />
                </div>
                <div style={{ width: "auto" }}>
                  <Select
                    label="Operators"
                    options={operators}
                    onChange={handleSelectOperatorChange}
                    value={selectedOperator}
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <Select
                    label="Fields"
                    options={selectList}
                    onChange={handleSelectSecondChange}
                    value={selectedSecond}
                  />
                </div>
              </InlineStack>
            </Card>
          </div>
        </Form>
        <TitleBar title="File Field Combine">
          <button
            disabled={isSave()}
            variant="primary"
            onClick={handleAddCombine}
          >
            Save
          </button>
          <button onClick={() => shopify.modal.hide("combine-modal")}>
            Cancel
          </button>
        </TitleBar>
      </Modal>
    </>
  );
};

export default CombineCard;
