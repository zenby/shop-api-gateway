import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import csvParser from "csv-parser";
import { checkRequiredEnvValues } from "../utils/envUtils";
import { handleUnexpectedError, prepareResponse } from "../utils/responseUtils";

checkRequiredEnvValues();

const client = new S3Client({ region: process.env.AWS_S3_REGION });
const Bucket = process.env.BUCKET_NAME;

export const handler = handleUnexpectedError(async (event) => {
  for (const record of event.Records) {
    const { key } = record.s3.object;
    const { Body } = await client.send(new GetObjectCommand({ Bucket, Key: key }));

    let results = [];
    for await (const chunk of Body.pipe(csvParser())) {
      results.push(chunk);
    }

    console.log(results);

    await client.send(
      new CopyObjectCommand({
        Bucket,
        Key: key.replace("uploaded", "parsed"),
        CopySource: `${Bucket}/${key}`,
      })
    );

    await client.send(new DeleteObjectCommand({ Bucket, Key: key }));
  }

  return prepareResponse(200);
});
