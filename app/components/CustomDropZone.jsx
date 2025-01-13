import { DropZone, Thumbnail, Text, BlockStack } from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";
import { useFileContext } from "../context/FileContext";

export function DropZoneExample() {
  const { files, addFile } = useFileContext();
  

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
     
      addFile(acceptedFiles[0]);
    },
    [],
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: "0",textAlign:"center",height:"100%" }}>
      <div style={{display:"flex",alignItems:"center", justifyContent:"center",height:"100%" }} >
        {files.map((file, index) => (
          <div key={index} style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
            <div>
              {file.name}{" "}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
    </>
  );
}


