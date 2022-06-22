import ProductService from "./productModule";
import { prepareResponse } from "./utils/responseUtils";
import { checkRequiredEnvValues } from "./utils/envUtils";

checkRequiredEnvValues();

export const handler = async (event) => {
  const productService = new ProductService();
  const { productId } = event.pathParameters;
  const product = await productService.getProductById(productId);

  if (product) {
    return prepareResponse(200, product);
  }

  return prepareResponse(404, { message: "Product was not found" });
};
