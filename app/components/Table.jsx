import { DataTable, Card } from "@shopify/polaris";
import React, { useMemo } from "react";

const Table = ({ tableData, fields }) => {
  const newRows = useMemo(() => {
    let dataRow = [];
    for (let i = 0; i < tableData.length; i++) {
      let row = [];
      for (let j = 0; j < fields.length; j++) {
        row.push(tableData[i][fields[j]]);
      }
      dataRow.push(row);
    }
    return dataRow;
  }, [tableData, fields]);
  return (
    <Card>
      <DataTable columnContentTypes={[]} headings={fields} rows={newRows} />
    </Card>
  );
};

export default Table;
