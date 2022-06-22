import ProductService from "./productModule";
import { handleUnexpectedError, prepareResponse } from "./utils/responseUtils";
import { checkRequiredEnvValues } from "./utils/envUtils";
import { logger } from "./utils/logger";

checkRequiredEnvValues();

export const handler = handleUnexpectedError(async (event) => {
  const { productId } = event.pathParameters;
  logger("info", "productById called", { productId });
  const productService = new ProductService();
  const product = await productService.getProductById(productId);

  if (product) {
    return prepareResponse(200, product);
  }

  logger("info", "productById was not found");
  return prepareResponse(404, { message: "Product was not found" });
});
