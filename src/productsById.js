import ProductService from "./productService";
import { handleUnexpectedError, prepareResponse } from "./utils/responseUtils";
import { checkRequiredEnvValues } from "./utils/envUtils";
import { logger } from "./utils/logger";
import { validateData } from "./utils/validationUtils";

checkRequiredEnvValues();

const productIdSchema = {
  type: "string",
  format: "uuid",
};

export const handler = handleUnexpectedError(async (event) => {
  const { productId } = event.pathParameters;
  logger("info", "productById called", { productId });
  const validationError = validateData(productId, productIdSchema);

  if (validationError) {
    return prepareResponse(422, { message: validationError });
  }

  const productService = new ProductService();
  const product = await productService.getProductById(productId);

  if (product) {
    return prepareResponse(200, product);
  }

  logger("info", "productById was not found");
  return prepareResponse(404, { message: "Product was not found" });
});
