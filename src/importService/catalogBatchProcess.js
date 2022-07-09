import ProductService from "../productService/productModule";
import { productSchema } from "../productService/productModule/productSchema";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { handleUnexpectedError, prepareTextResponse } from "../utils/responseUtils";
import { validateData } from "../utils/validationUtils";

checkRequiredEnvValues();

export const handler = handleUnexpectedError(async (event) => {
  const products = event.Records.map(({ body }) => parseProductData(body));

  const productService = new ProductService();

  for (const product of products) {
    const validationError = validateData(product, productSchema);
    if (!validationError) {
      await productService.createProduct(product);
    }
  }

  console.log(products);

  return prepareTextResponse(200);
});

function parseProductData(data) {
  const product = JSON.parse(data);

  return {
    ...product,
    ...(product.price ? { price: Number(product.price) } : {}),
    ...(product.amount ? { amount: Number(product.amount) } : {}),
  };
}
