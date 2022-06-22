import { validate } from "jsonschema";

export function validateData(data, schema) {
  const validationResult = validate(data, schema);

  return validationResult.errors.length ? getValidationMessage(validationResult.errors) : null;
}

function getValidationMessage(errors) {
  return errors.map((err) => (err.name === "type" ? err.stack : err.message)).join(", ");
}
