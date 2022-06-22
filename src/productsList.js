import ProductService from "./productModule";
import { prepareResponse } from "./utils/responseUtils";
import { checkRequiredEnvValues } from "./utils/envUtils";

checkRequiredEnvValues();

export const handler = async () => {
  const productService = new ProductService();
  const products = await productService.getAllProducts();

  return prepareResponse(200, products);
};
