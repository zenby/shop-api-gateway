import { handler } from "../src/productsById";

describe("productById", () => {
  it("returns 200 with data if product exists", async () => {
    const productId = "3";
    const result = await handler({ pathParameters: { productId } });

    expect(result.headers).toBeDefined();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).id).toBe(productId);
  });

  it("returns 404 with message if product was not found", async () => {
    const productId = "55";
    const result = await handler({ pathParameters: { productId } });

    expect(result.headers).toBeDefined();
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe("Product was not found");
  });
});
