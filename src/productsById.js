import ProductService from "./productModule";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async (event) => {
  try {
    const productService = new ProductService();
    const id = event.pathParameters.productId;

    const product = await productService.getProductById(id);

    if (product) {
      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(product),
      };
    }

    return {
      headers,
      statusCode: 404,
      body: JSON.stringify({ message: "Product was not found" }),
    };
  } catch (e) {
    return {
      headers,
      statusCode: 404,
      body: e.message,
    };
  }
};
