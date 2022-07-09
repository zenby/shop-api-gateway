import ProductService from "../productService/productModule";
import { productSchema } from "../productService/productModule/productSchema";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { handleUnexpectedError, prepareTextResponse } from "../utils/responseUtils";
import { validateData } from "../utils/validationUtils";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

checkRequiredEnvValues();

export const handler = handleUnexpectedError(async (event) => {
  const products = event.Records.map(({ body }) => parseProductData(body));

  const productService = new ProductService();

  for (const product of products) {
    const validationError = validateData(product, productSchema);
    if (!validationError) {
      await productService.createProduct(product);
    }
  }

  console.log(products);
  await sendProductsImportEmail(products);

  return prepareTextResponse(200);
});

async function sendProductsImportEmail(products) {
  const snsClient = new SNSClient({ region: process.env.AWS_S3_REGION });

  await snsClient.send(
    new PublishCommand({
      Message: `Next products has been imported ${JSON.stringify(products)}`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        is_expensive_product: {
          DataType: "String",
          StringValue: products.some((p) => p.price > 100) ? "yes" : "no",
        },
      },
    })
  );
}

function parseProductData(data) {
  const product = JSON.parse(data);

  return {
    ...product,
    ...(product.price ? { price: Number(product.price) } : {}),
    ...(product.amount ? { amount: Number(product.amount) } : {}),
  };
}
