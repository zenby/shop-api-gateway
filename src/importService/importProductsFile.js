import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { handleUnexpectedError, prepareTextResponse } from "../utils/responseUtils";

checkRequiredEnvValues();

const client = new S3Client({ region: process.env.AWS_S3_REGION });
const Bucket = process.env.BUCKET_NAME;

export const handler = handleUnexpectedError(async (event) => {
  const { name } = event.queryStringParameters;
  const command = new PutObjectCommand({ Bucket, Key: `uploaded/${name}` });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log(url);

  return prepareTextResponse(200, url);
});
