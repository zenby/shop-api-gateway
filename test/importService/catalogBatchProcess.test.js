import { handler } from "../../src/importService/catalogBatchProcess";
import { PublishCommand } from "@aws-sdk/client-sns";

const mockCreateProduct = jest.fn();
const mockSnsSend = jest.fn();

jest.mock("../../src/utils/envUtils", () => ({
  checkRequiredEnvValues: jest.fn(),
}));

jest.mock("../../src/productService/productModule/productRepository", function () {
  return () => ({
    createProduct: mockCreateProduct,
  });
});

jest.mock("@aws-sdk/client-sns", () => ({
  PublishCommand: jest.fn(),
  SNSClient: () => ({ send: mockSnsSend }),
}));

describe("catalogBatchProcess", () => {
  let snsArn;

  beforeAll(() => {
    snsArn = process.env.SNS_ARN;
    process.env.SNS_ARN = "SNS_ARN";
  });

  afterAll(() => {
    process.env.SNS_ARN = snsArn;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("send email and but not create products when data is incorrect", async () => {
    const products = [{ title: "title1", price: 2, amount: 2 }];
    const { statusCode } = await handler(createEventWithBody(products));

    expect(statusCode).toBe(200);
    expect(mockSnsSend).toHaveBeenCalled();
    expect(PublishCommand).toHaveBeenCalled();
    expect(PublishCommand.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        Message: expect.stringContaining(JSON.stringify(products)),
        MessageAttributes: {
          is_expensive_product: expect.objectContaining({
            StringValue: "no",
          }),
        },
      })
    );
    expect(mockCreateProduct).toHaveBeenCalledTimes(0);
  });

  it("send email and create products when data is correct for cheap products", async () => {
    const products = [{ title: "title2", description: "description2", price: 3, amount: 4 }];
    const { statusCode } = await handler(createEventWithBody(products));

    expect(statusCode).toBe(200);
    expect(mockSnsSend).toHaveBeenCalled();
    expect(PublishCommand).toHaveBeenCalled();
    expect(PublishCommand.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        Message: expect.stringContaining(JSON.stringify(products)),
        MessageAttributes: {
          is_expensive_product: expect.objectContaining({
            StringValue: "no",
          }),
        },
      })
    );
    expect(mockCreateProduct).toHaveBeenCalledTimes(products.length);
  });

  it("send email and create products when data is correct for expensive products", async () => {
    const products = [{ title: "title5", description: "description5", price: 600, amount: 7 }];
    const { statusCode } = await handler(createEventWithBody(products));

    expect(statusCode).toBe(200);
    expect(mockSnsSend).toHaveBeenCalled();
    expect(PublishCommand).toHaveBeenCalled();
    expect(PublishCommand.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        Message: expect.stringContaining(JSON.stringify(products)),
        MessageAttributes: {
          is_expensive_product: expect.objectContaining({
            StringValue: "yes",
          }),
        },
      })
    );
    expect(mockCreateProduct).toHaveBeenCalledTimes(products.length);
  });
});

function createEventWithBody(body) {
  return { Records: body.map((i) => ({ body: JSON.stringify(i) })) };
}
