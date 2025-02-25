import { CalloutCard } from "@shopify/polaris";
import React from "react";


export function CustomCalledOut(props) {
  const {
    title,
    illustration,
    primaryActionContent,
    primaryActionUrl,
    children,
  } = props;
  return (
    <CalloutCard
      title={title}
      illustration={
        "https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
      }
      primaryAction={{
        content: primaryActionContent,
        url: primaryActionUrl,
      }}
    >
      <br />
      {children}
    </CalloutCard>
  );
}