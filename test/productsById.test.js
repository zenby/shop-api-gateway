import { handler } from "../src/productsById";
import ProductRepository from "../src/productModule/productRepository";

const mockedProduct = { id: 2 };

jest.mock("../src/utils/envUtils", () => ({
  checkRequiredConfigValues: jest.fn(),
}));

jest.mock("../src/productModule/productRepository");

describe("productById", () => {
  beforeAll(() => {
    ProductRepository.mockImplementationOnce(() => ({
      getProductById: jest.fn(() => mockedProduct).mockImplementationOnce(() => mockedProduct),
    })).mockImplementationOnce(() => ({
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
    const { headers, statusCode, body } = await handler({ pathParameters: { productId: 44 } });

    expect(headers).toBeDefined();
    expect(statusCode).toBe(404);
    expect(JSON.parse(body).message).toBe("Product was not found");
  });
});
