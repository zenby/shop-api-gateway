export function checkRequiredEnvValues() {
  const requiredConfigValues = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USERNAME",
    "DB_PASSWORD",
    "BUCKET_NAME",
    "AWS_S3_REGION",
    "SQS_URL",
    "SNS_ARN",
  ];

  const missingEntries = requiredConfigValues.filter((name) => !process.env[name]);
  if (missingEntries.length !== 0) {
    const message = `Make sure you have ${missingEntries.join(", ")} in your .env file.`;

    throw new Error(message);
  }
}
