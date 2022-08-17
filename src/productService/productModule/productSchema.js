export const productSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    image: { type: "string" },
    price: { type: "number" },
    amount: { type: "number" },
  },
  required: ["title", "description", "price", "image"],
};
