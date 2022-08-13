import { handler } from "../../src/productService/createProduct";

const mockedProduct = { productId: 1 };

jest.mock("../../src/utils/envUtils", () => ({
  checkRequiredEnvValues: jest.fn(),
}));

jest.mock("../../src/productService/productModule/productRepository", function () {
  return () => ({
    createProduct: jest.fn(() => mockedProduct),
  });
});

describe("createProduct", () => {
  it("returns 422 when fields are missed", async () => {
    const product = { title: "title" };
    const event = { body: JSON.stringify(product) };
    const { body, headers, statusCode } = await handler(event);

    expect(headers).toBeDefined();
    expect(statusCode).toBe(422);
    expect(JSON.parse(body).message).toBe('requires property "description", requires property "price"');
  });

  it("returns 422 when fields have wrong type", async () => {
    const product = { title: "title", price: "price", description: "desc" };
    const event = { body: JSON.stringify(product) };
    const { body, headers, statusCode } = await handler(event);

    expect(headers).toBeDefined();
    expect(statusCode).toBe(422);
    expect(JSON.parse(body).message).toBe("price is not of a type(s) number");
  });

  it("returns 201 with product id for valid product data", async () => {
    const product = {
      title: "title",
      price: 22.22,
      description: "desc",
      amount: 4,
      image: "https://images.unsplash.com/photo-1519173005431-c6fe836d46eb",
    };
    const event = { body: JSON.stringify(product) };
    const { headers, statusCode } = await handler(event);

    expect(headers).toBeDefined();
    expect(statusCode).toBe(201);
  });
});
