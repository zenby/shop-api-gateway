import { handler } from "../src/productsById";
import ProductRepository from "../src/productModule/productRepository";

const mockedProduct = { id: "1ac5310f-1025-4196-b49e-5188d1f0f63c" };

jest.mock("../src/utils/envUtils", () => ({
  checkRequiredEnvValues: jest.fn(),
}));

jest.mock("../src/productModule/productRepository");

describe("productById", () => {
  beforeAll(() => {
    ProductRepository.mockImplementationOnce(() => ({
      getProductById: jest.fn(() => mockedProduct).mockImplementationOnce(() => mockedProduct),
    })).mockImplementation(() => ({
      getProductById: jest.fn(() => null),
    }));
  });

  it("returns 200 with data if product exists", async () => {
    const { headers, statusCode, body } = await handler({ pathParameters: { productId: mockedProduct.id } });

    expect(headers).toBeDefined();
    expect(statusCode).toBe(200);
    expect(JSON.parse(body).id).toBe(mockedProduct.id);
  });

  it("returns 404 with message if product was not found", async () => {
    const { headers, statusCode, body } = await handler({ pathParameters: { productId: mockedProduct.id } });

    expect(headers).toBeDefined();
    expect(statusCode).toBe(404);
    expect(JSON.parse(body).message).toBe("Product was not found");
  });

  it("returns 422 with message if parameter is not support uuid format", async () => {
    const { headers, statusCode, body } = await handler({ pathParameters: { productId: 25} });

    expect(headers).toBeDefined();
    expect(statusCode).toBe(422);
    expect(JSON.parse(body).message).toBe("25 is not of a type(s) string");
  });
});
