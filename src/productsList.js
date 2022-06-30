import ProductService from "./productService";
import { handleUnexpectedError, prepareResponse } from "./utils/responseUtils";
import { checkRequiredEnvValues } from "./utils/envUtils";
import { logger } from "./utils/logger";

checkRequiredEnvValues();

export const handler = handleUnexpectedError(async () => {
  logger("info", "productsList called");
  const productService = new ProductService();
  const products = await productService.getAllProducts();

  return prepareResponse(200, products);
});
