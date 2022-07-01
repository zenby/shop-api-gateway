const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export function prepareResponse(statusCode, data = {}) {
  return prepareTextResponse(statusCode, JSON.stringify(data));
}

export function prepareTextResponse(statusCode, data) {
  return {
    headers,
    statusCode,
    body: data,
  };
}

export function handleUnexpectedError(handler) {
  return async function (...args) {
    return Promise.resolve(handler(...args)).catch((e) => {
      return prepareResponse(500, { message: e.message || "Server error" });
    });
  };
}
