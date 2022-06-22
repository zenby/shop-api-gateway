const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export function prepareResponse(statusCode, data) {
  return {
    headers,
    statusCode,
    body: JSON.stringify(data),
  };
}
