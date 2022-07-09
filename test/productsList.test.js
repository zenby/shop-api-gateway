import { handler } from "../src/productsList";

describe("productsList", () => {
  it("returns 200 with data", async () => {
    const result = await handler();

    expect(result.headers).toBeDefined();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).length).toBe(9);
  });
});
