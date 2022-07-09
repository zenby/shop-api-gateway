import ProductService from "./productModule";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async () => {
  const productService = new ProductService();
  const products = await productService.getAllProducts();

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
