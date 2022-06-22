import { validate } from "jsonschema";

export function validateData(product, schema) {
  const validationResult = validate(product, schema);

  return validationResult.errors.length ? getValidationMessage(validationResult.errors) : null;
}

function getValidationMessage(errors) {
  return errors.map((err) => (err.name === "type" ? err.stack : err.message)).join(", ");
}
