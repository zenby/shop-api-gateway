import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { handler } from "../../src/importService/importProductsFile";

jest.mock("../../src/utils/envUtils", () => ({
  checkRequiredEnvValues: jest.fn(),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(() => "signedUrl"),
}));

describe("importProductsFile", () => {
  let bucket;

  beforeAll(() => {
    bucket = process.env.BUCKET_NAME;
    process.env.BUCKET_NAME = "BUCKET";
  });

  afterAll(() => {
    process.env.BUCKET_NAME = bucket;
  });

  it("returns 200 with data", async () => {
    const event = { queryStringParameters: { name: "filename" } };
    const { body, headers, statusCode } = await handler(event);

    expect(getSignedUrl).toHaveBeenCalled();
    expect(headers).toBeDefined();
    expect(statusCode).toBe(200);

    const signedUrl = getSignedUrl.mock.results[0].value;
    expect(body).toBe(signedUrl);
  });
});
