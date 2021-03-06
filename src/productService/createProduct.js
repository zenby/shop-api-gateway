import ProductService from "./productModule";
import { handleUnexpectedError, prepareResponse } from "../utils/responseUtils";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { validateData } from "../utils/validationUtils";
import { logger } from "../utils/logger";
import { productSchema } from "./productModule/productSchema";

checkRequiredEnvValues();

export const handler = handleUnexpectedError(async (event) => {
  const product = JSON.parse(event.body);
  logger("info", "createProduct called", { product });

  const validationError = validateData(product, productSchema);
  if (validationError) {
    return prepareResponse(422, { message: validationError });
  }

  try {
    const productService = new ProductService();
    const { productId } = await productService.createProduct(product);

    return prepareResponse(201, { productId });
  } catch (e) {
    logger("error", "createProduct error", { product });
    return prepareResponse(400, { message: e.message || e });
  }
});
