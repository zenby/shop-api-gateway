import ProductService from "./productModule";
import { headers } from "./utils/corsUtils";
import { checkRequiredConfigValues } from "./utils/envUtils";

checkRequiredConfigValues();

export const handler = async (event) => {
  const productService = new ProductService();
  const { productId } = event.pathParameters;

  const product = await productService.getProductById(productId);

  if (product) {
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(product),
    };
  }

  return {
    headers,
    statusCode: 404,
    body: JSON.stringify({ message: "Product was not found" }),
  };
};
