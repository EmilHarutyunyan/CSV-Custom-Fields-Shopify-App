import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Form,
  InlineStack,
  Layout,
  Page,
  SkeletonBodyText,
  Text,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { CustomCalledOut } from "../components/CustomCalledOut";
import { DropZoneExample } from "../components/CustomDropZone";
import { useFileContext } from "../context/FileContext";
import Papa from "papaparse";
import { DeleteIcon, ViewIcon } from "@shopify/polaris-icons";
import Table from "../components/Table";
import FormFields from "../components/FormFields";
import { useFormContext } from "../context/FormContext";
import CombineCard from "../components/CombineCard";
import { useFieldCombineContext } from "../context/FieldCombineContext";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useSaveContext } from "../context/SaveContext";
export const loader = async ({ request, params }) => {
  await authenticate.admin(request);
  const id = parseInt(params.id);
  const template = await prisma.template.findUnique({
    where: { id },
  });
  let data = "";
  try {
    data = JSON.parse(template.data);
  } catch (error) {}

  return json({ ...template, data });
};
export const action = async ({ request, params }) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");
  const id = parseInt(formData.get("id"));
  const data = formData.get("data") || "";

  try {
    if (action === "update") {
      await prisma.template.update({
        where: { id },
        data: {
          data,
        },
      });
      return redirect(`/app/file/${id}`);
    }
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
  return null;
};

const FilePage = () => {
  const template = useLoaderData();
  const submit = useSubmit();
  const [saveLoading, setSaveLoading] = useState(false);
  const { files, clearFiles } = useFileContext();
  const { clearFields, formFields } = useFormContext();
  const { fieldCombine } = useFieldCombineContext();
  const { isSave, resetIsSave } = useSaveContext();
  const [tableData, setTableData] = useState([]);
  const [fileFields, setFileFields] = useState([]);

  const nav = useNavigation();
  const isSaving = nav.state === "submitting" && nav.formData?.get("action") === "update";

  useEffect(()=> {
    if(!isSaving) {
      document.getElementById("file-save-bar").hide();
    }
  },[isSaving])

  useEffect(() => {
    return () => {
      clearFiles();
      clearFields();
      setTableData([]);
      setFileFields([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if (files.length) {
      const file = files[0];
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setFileFields(results.meta.fields);
          setTableData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  }, [files]);

  useEffect(() => {
    if (isSave) {
      document.getElementById("file-save-bar").show();
      document
        .getElementById("file-save-button")
        .addEventListener("click", handleSave);
      document
        .getElementById("file-discard-button")
        .addEventListener("click", handleDiscard);

      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener("popstate", function (event) {
        if (isSave) {
          window.history.pushState(null, document.title, window.location.href);
        }
      });
      return () => {
        document
          .getElementById("file-save-button")
          .removeEventListener("click", handleSave);
        document
          .getElementById("file-discard-button")
          .removeEventListener("click", handleDiscard);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSave, formFields, fieldCombine]);
  const handleRemove = useCallback(() => {
    if (files.length) {
      clearFiles();
      clearFields();
      setTableData([]);
      setFileFields([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleView = useCallback(() => {
    document.getElementById("table-modal").show();
  }, []);

  const checkCombine = (combine) => {
    return fieldCombine.filter(
      (field) =>
        `${field.firstField} ${field.operator} ${field.secondField}` ===
        combine,
    );
  };
  const handleDownloadLoading = useCallback(
    (loading) => {
      setSaveLoading(loading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveLoading, setSaveLoading],
  );
  const handleDownload = useCallback(() => {
    let csvNewData = [];
    handleDownloadLoading(true);
    tableData.forEach((data) => {
      let itemObject = {};
      formFields.forEach((field) => {
        let combine = checkCombine(field.oldField);
        if (combine.length) {
          let firstField = data[combine[0].firstField];
          let secondField = data[combine[0].secondField];
          if (data[combine[0].firstField] && data[combine[0].secondField]) {
            // eslint-disable-next-line no-eval
            let value = eval(
              `${firstField} ${combine[0].operator} ${secondField}`,
            );
            itemObject[field.newField] = value;
          }
        } else if (data[field.oldField]) {
          itemObject[field.newField] = data[field.oldField];
        } else {
          itemObject[field.newField] = "";
        }
      });
      csvNewData.push(itemObject);
    });
    let csv = Papa.unparse(csvNewData);

    let csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, files[0].name);
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", files[0].name);
    tempLink.click();
    handleDownloadLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields, tableData]);

  const handleSave = async () => {
    let data = {
      fieldCombineData: [...fieldCombine],
      orderData: [...formFields],
    };
    await submit(
      { data: JSON.stringify(data),id:template.id, action: "update" },
      { method: "post" },
    );
    
    resetIsSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  const handleDiscard = useCallback(() => {
    document.getElementById("file-save-bar").hide();
    resetIsSave();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSave]);
  if(typeof window === 'undefined') return <SkeletonBodyText />
  return (
    <Page backAction={{ url: !isSave ? "/app": "" }} title={template.name}>
      <Layout>
        <Layout.Section>
          <InlineStack align="end">
            <ButtonGroup>
              <Button
                disabled={!tableData.length}
                variant="primary"
                icon={ViewIcon}
                onClick={handleView}
              >
                View
              </Button>
              <Button
                disabled={!tableData.length}
                variant="primary"
                tone="critical"
                icon={DeleteIcon}
                onClick={handleRemove}
              >
                Delete
              </Button>
            </ButtonGroup>
          </InlineStack>
          <br />
          <Card>
            <Text as="h4" variant="headingMd">
              Import
            </Text>
            <DropZoneExample />
          </Card>
        </Layout.Section>
        <Layout.Section>
          {files.length ? (
            <Card>
              <Text as="h4" variant="headingMd">
                File Fields
              </Text>
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                {fileFields.length > 0 ? (
                  <InlineStack gap="200" style={{ marginTop: "30px" }}>
                    {fileFields.map((field, idx) => (
                      <Badge key={idx}>{field}</Badge>
                    ))}
                  </InlineStack>
                ) : null}
              </div>
            </Card>
          ) : null}
          <br />
          <Card>
            <Text as="h4" variant="headingMd">
              Your Fields Equal
            </Text>
            <div
              style={{
                marginTop: "10px",
              }}
            >
              <InlineStack gap="200" style={{ marginTop: "30px" }}>
                {template?.data?.orderData &&
                  template?.data?.orderData?.map((item) => {
                    return (
                      <Badge key={item.id}>
                        {item.newField} - {item.oldField}
                      </Badge>
                    );
                  })}
              </InlineStack>
            </div>
          </Card>
          <br />

          <CombineCard
            fileFields={fileFields}
            fieldCombineData={template?.data?.fieldCombineData || []}
            isDisable={files.length > 0}
          />
        </Layout.Section>
        <Layout.Section>
          {fileFields.length ? (
            <FormFields
              fileFields={fileFields}
              handleDownload={handleDownload}
              saveLoading={isSaving}
              orderData={template.data.orderData || []}
              handleSave={handleSave}
            />
          ) : null}
          <br />
          <br />
        </Layout.Section>

        <ui-modal id="table-modal" variant="large">
          {tableData.length ? (
            <Table fields={fileFields} tableData={tableData} />
          ) : null}

          <ui-title-bar title="File"></ui-title-bar>
        </ui-modal>
      </Layout>
      <ui-save-bar id="file-save-bar">
        <button variant="primary" loading={isSaving ? "": false} disabled={!isSave} id="file-save-button">
          
        </button>
        <button  id="file-discard-button"></button>
      </ui-save-bar>
    </Page>
  );
};

export default FilePage;
