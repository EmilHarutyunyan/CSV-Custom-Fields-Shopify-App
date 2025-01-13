export const operators = [
  {
    label: "+",
    value: "+",
  },
  {
    label: "-",
    value: "-",
  },
  {
    label: "*",
    value: "*",
  },
  {
    label: "/",
    value: "/",
  },
  {
    label: "%",
    value: "%",
  },
];

export const fieldCombineData = [
  {
    firstField:"Lineitem quantity",
    operator:"*",
    secondField:"Lineitem price"
  }
]
export const template = {
  name:"name",
  id:"",
  data : {
    fieldCombineData: [{
      firstField:"Lineitem quantity",
      operator:"*",
      secondField:"Lineitem price"
    }],
    orderData:[
      { newField: "Lineitem name", oldField: "Product" },
      { newField: "Lineitem sku", oldField: "SKU" },
      { newField: "Lineitem quantity", oldField: "Quantity" },
      { newField: "Lineitem price", oldField: "Price" },
      { newField: "Payment Terms Name", oldField: "Term Code" },
      { newField: "Discount Amount", oldField: "Discount %" },
      { newField: "Name", oldField: "Order #" },
      { newField: "Lineitem quantity * Lineitem price", oldField: "Subtotal" },
      { newField: "Tax 1 Value", oldField: "Tax" },
      { newField: "Shipping", oldField: "Shipping_cost" },
      { newField: "Shipping Method", oldField: "Shipping Code" },
      { newField: "Location", oldField: "Location Code" },
      { newField: "Total", oldField: "Grand Total" },
      { newField: "Email", oldField: "Contact Name" },
      { newField: "Billing Name", oldField: "Customer Code" },
      { newField: "Paid at", oldField: "Date Ordered" }
    ]
  }
  
}
export const orderData = {
  'Lineitem name': 'Product',
  'Lineitem sku': 'SKU',
  'Lineitem quantity': 'Quantity',
  'Lineitem price': 'Price',
  'Payment Terms Name': 'Term Code',
  'Discount Amount': 'Discount %',
  'Name': 'Order #',
  'Lineitem quantity * Lineitem price': 'Subtotal',
  'Tax 1 Value': 'Tax',
  'Shipping': 'Shipping_cost',
  'Shipping Method': 'Shipping Code',
  'Location': 'Location Code',
  'Total': 'Grand Total',
  'Email': 'Contact Name',
  'Billing Name': 'Customer Code',
  'Paid at': 'Date Ordered',
};