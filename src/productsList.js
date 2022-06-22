import ProductService from "./productModule";
import { headers } from "./utils/corsUtils";
import { checkRequiredConfigValues } from "./utils/envUtils";

checkRequiredConfigValues();

export const handler = async () => {
  const productService = new ProductService();
  const products = await productService.getAllProducts();

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
