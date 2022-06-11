import ProductService from "./productModule";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async () => {
  try {
    const productService = new ProductService();
    const products = await productService.getAllProducts();

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      headers,
      statusCode: 404,
      body: e.message,
    };
  }
};
