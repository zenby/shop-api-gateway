import { handler } from "../src/productsList";

const mockedProducts = [{ id: 1 }, { id: 2 }];

jest.mock("../src/utils/envUtils", () => ({
  checkRequiredEnvValues: jest.fn(),
}));

jest.mock("../src/productService/productRepository", function () {
  return () => ({
    getAllProducts: jest.fn(() => mockedProducts),
  });
});

describe("productsList", () => {
  it("returns 200 with data", async () => {
    const { body, headers, statusCode } = await handler();

    expect(headers).toBeDefined();
    expect(statusCode).toBe(200);
    expect(JSON.parse(body).length).toBe(mockedProducts.length);
    expect(JSON.parse(body)[0]).toMatchObject(mockedProducts[0]);
    expect(JSON.parse(body)[1]).toMatchObject(mockedProducts[1]);
  });
});
