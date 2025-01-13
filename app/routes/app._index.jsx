import { useEffect, useState } from "react";
import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { Page, Layout, Card, TextField, EmptyState, SkeletonBodyText } from "@shopify/polaris";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import TemplateTable from "../components/TemplateTable";
import { CustomCalledOut } from "../components/CustomCalledOut";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const templates = await prisma.template.findMany();
  const parsedTemplates = templates.map((template) => ({
    ...template,
    data: template.data,
  }));
  return parsedTemplates;
};

export const action = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const action = formData.get("action");
  const id = parseInt(formData.get("id"));
  const data = formData.get("data") || "";
  const selectedIds = JSON.parse(formData.get("selectedIds")) || [];
  try {
    if (action === "create") {
      const createdTemplate = await prisma.template.create({
        data: {
          name,
          data: JSON.stringify({
            fieldCombineData: [],
            orderData: [],
          }),
        },
      });
      return json({ success: true, template: createdTemplate });
    }
    if (action === "update") {
      const updatedTemplate = await prisma.template.update({
        where: { id },
        data: {
          name,
        },
      });
      return json({ success: true, template: updatedTemplate });
    }
    if (action === "delete") {
      await prisma.template.deleteMany({
        where: {
          id: {
            in: selectedIds,
          },
        },
      });
      return json({ success: true, delete: true });
    }
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
  return null;
};

export default function Index() {
  const submit = useSubmit();
  const shopify = useAppBridge();
  const templates = useLoaderData();
  const actionData = useActionData();

  if (actionData?.success) {
    shopify.modal.hide("template-create");
  }

  const [name, setName] = useState("");
  const [selectTemplate, setSelectTemplate] = useState({});

  const handleSubmit = async () => {
    await submit({ name, action: "create" }, { method: "post" });
    setName("");
  };
  const handleEdit = ({ template, removeSelectedResources }) => {
    setSelectTemplate(template);
    shopify.modal.show("template-edit");
    removeSelectedResources([template.id]);
  };
  const handleUpdate = async ({ name, id }) => {
    await submit(
      { name: selectTemplate.name, id: selectTemplate.id, action: "update" },
      { method: "post" },
    );
    setSelectTemplate({});
    shopify.modal.hide("template-edit");
  };

  const handleDelete = async (selectedIds) => {
    await submit(
      { selectedIds: JSON.stringify(selectedIds), action: "delete" },
      { method: "post" },
    );
  };
  if(typeof window === 'undefined') return <SkeletonBodyText />
  return (
    <Page
      title="Template Manager"
      primaryAction={{
        content: "Create Template",
        onAction: () => shopify.modal.show("template-create"),
      }}
    >
      <Layout>
        {templates.length === 0 ? (
          <Layout.Section>

            <Card>
              <EmptyState
                heading="You can create a new template"
                action={{
                  content: "Create Template",
                  onAction: () => shopify.modal.show("template-create"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              />
            </Card>
          </Layout.Section>
        ) : (
          <Layout.Section>
            <Card title="Existing Templates">
              <TemplateTable
                templates={templates}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            </Card>
          </Layout.Section>
        )}
        <Layout.Section>
          <br />
          <CustomCalledOut
            title={"Support"}
            illustration={""}
            primaryActionContent={"Contact Support"}
            primaryActionUrl={""}
            children={
              "If you have any questions, issues, missing features or concerns - don't guess, don't wait - contact us and we will help you."
            }
          />
          <br />
        </Layout.Section>
        <Modal id="template-create">
          <Card>
            <Form method="post">
              <TextField
                label="Template Name"
                value={name}
                onChange={(value) => setName(value)}
                name="name"
                required
              />
            </Form>
          </Card>
          <TitleBar title="Create Template">
            <button disabled={!name} variant="primary" onClick={handleSubmit}>
              Save
            </button>
            <button onClick={() => shopify.modal.hide("template-create")}>
              Cancel
            </button>
          </TitleBar>
        </Modal>

        <Modal id="template-edit">
          <Card>
            <Form method="post">
              <TextField
                label="Template Name"
                value={selectTemplate?.name || ""}
                onChange={(value) => {
                  setSelectTemplate((prevState) => {
                    return { ...prevState, name: value };
                  });
                }}
                name="name"
                required
              />
            </Form>
          </Card>
          <TitleBar title="Edit Template Name">
            <button
              disabled={!selectTemplate.name}
              variant="primary"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button onClick={() => shopify.modal.hide("template-edit")}>
              Cancel
            </button>
          </TitleBar>
        </Modal>
      </Layout>
    </Page>
  );
}
