import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { handleUnexpectedError, prepareTextResponse } from "../utils/responseUtils";

checkRequiredEnvValues();

const client = new S3Client({ region: process.env.AWS_S3_REGION });

export const handler = handleUnexpectedError(async (event) => {
  const { name } = event.queryStringParameters;
  const command = new PutObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: `uploaded/${name}` });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return prepareTextResponse(200, signedUrl);
});
