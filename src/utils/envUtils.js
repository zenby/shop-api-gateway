export function checkRequiredConfigValues() {
  const requiredConfigValues = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USERNAME", "DB_PASSWORD"];

  const missingEntries = requiredConfigValues.filter((name) => !process.env[name]);
  if (missingEntries.length !== 0) {
    const message = `Make sure you have ${missingEntries.join(", ")} in your .env file.`;

    throw new Error(message);
  }
}
