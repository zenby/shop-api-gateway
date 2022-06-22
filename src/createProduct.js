import ProductService from "./productModule";
import { prepareResponse } from "./utils/responseUtils";
import { checkRequiredEnvValues } from "./utils/envUtils";
import { validateData } from "./utils/validationUtils";

checkRequiredEnvValues();

const productSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    amount: { type: "number" },
  },
  required: ["title", "description", "price"],
};

export const handler = async (event) => {
  const product = JSON.parse(event.body);
  const error = validateData(product, productSchema);

  if (error) {
    return prepareResponse(422, { message: error });
  }

  const productService = new ProductService();
  const productId = await productService.createProduct(product);

  return prepareResponse(201, { productId });
};