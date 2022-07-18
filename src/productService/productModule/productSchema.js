export const productSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    amount: { type: "number" },
  },
  required: ["title", "description", "price"],
};
