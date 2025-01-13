"use client";
import {
  IndexTable,
  useIndexResourceState,
  Text,
  Link,
  Card,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import React, { useEffect, useMemo,  useState } from "react";
import { formatTimestamp } from "../utils/utils";

const TemplateTable = ({ templates, handleDelete, handleEdit }) => {
  const [loaded, setLoaded] = useState(false);


  const resourceName = {
    singular: "templates",
    plural: "template",
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    removeSelectedResources,
  } = useIndexResourceState(templates);

  const rowMarkup = templates.map(({ id, name, updatedAt }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          #{id}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          dataPrimaryLink
          url={`/app/file/${id}/`}
          
        >
          <Text fontWeight="bold" as="span">
            {name}
          </Text>
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end">
          {formatTimestamp(updatedAt)}
         
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const promotedBulkActions = useMemo(
    () => [
      {
        content: "Edit",
        disabled: selectedResources.length === 1 ? false : true,
        onAction: () => {

          let template = templates.filter((item) =>
            selectedResources.includes(item.id),
          )[0];
          
          handleEdit({ template, removeSelectedResources });
        },
      },
      {
        content: "Delete",
        icon: DeleteIcon,
        onAction: () => handleDelete(selectedResources),
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedResources],
  );
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
      {loaded && (
        <Card>
          <IndexTable
           
            resourceName={resourceName}
            itemCount={templates.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Id" },
              { title: "Name" },
              { title: "Date", alignment: "end" },
            ]}
            promotedBulkActions={promotedBulkActions}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      )}
    </>
  );
};

export default TemplateTable;
