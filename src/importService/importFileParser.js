import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import csvParser from "csv-parser";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { handleUnexpectedError, prepareResponse } from "../utils/responseUtils";

checkRequiredEnvValues();

const s3Client = new S3Client({ region: process.env.AWS_S3_REGION });
const Bucket = process.env.BUCKET_NAME;

export const handler = handleUnexpectedError(async (event) => {
  for (const record of event.Records) {
    const { key } = record.s3.object;
    const { Body } = await s3Client.send(new GetObjectCommand({ Bucket, Key: key }));

    const parsedProducts = [];
    for await (const chunk of Body.pipe(csvParser())) {
      parsedProducts.push(chunk);
    }

    console.log(parsedProducts);

    await sendProductsToQueue(parsedProducts);
    await moveFileToParsedFolder(key);
  }

  return prepareResponse(200);
});

async function moveFileToParsedFolder(key) {
  await s3Client.send(
    new CopyObjectCommand({
      Bucket,
      Key: key.replace("uploaded", "parsed"),
      CopySource: `${Bucket}/${key}`,
    })
  );

  await s3Client.send(new DeleteObjectCommand({ Bucket, Key: key }));
}

async function sendProductsToQueue(products) {
  const sqsClient = new SQSClient({ region: process.env.AWS_S3_REGION });

  for (const product of products) {
    const params = {
      DelaySeconds: 5,
      MessageBody: JSON.stringify(product),
      QueueUrl: process.env.SQS_URL,
    };

    await sqsClient.send(new SendMessageCommand(params));
  }
}
