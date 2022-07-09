import { handleUnexpectedError, prepareResponse } from "../../src/utils/responseUtils";

const successHandlerData = { data: 12 };
async function handlerWithoutError(event) {
  return prepareResponse(200, successHandlerData);
}

describe("handleUnexpectedError", () => {
  it("is function", () => {
    expect(typeof handleUnexpectedError).toBe("function");
  });

  it("return type is function", () => {
    expect(typeof handleUnexpectedError(handlerWithoutError)).toBe("function");
  });

  it("pass arguments to internal handler", async () => {
    const handler = jest.fn();
    const args = [{ id: 1 }, "context"];
    const res = await handleUnexpectedError(handler)(...args);

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(...args);
  });

  it("returns 200 when no errors in handler", async () => {
    const res = await handleUnexpectedError(handlerWithoutError)();
    const { body, headers, statusCode } = res;

    expect(headers).toBeDefined();
    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toStrictEqual(successHandlerData);
  });

  it("returns 500 when unexpected error happens with error message", async () => {
    const res = await handleUnexpectedError(async (event) => {
      throw Error("error");
    })();
    const { body, headers, statusCode } = res;

    expect(headers).toBeDefined();
    expect(statusCode).toBe(500);
    expect(JSON.parse(body).message).toStrictEqual("error");
  });

  it("returns 500 when unexpected error happens without error message", async () => {
    const res = await handleUnexpectedError(async (event) => {
      throw Error();
    })();
    const { body, headers, statusCode } = res;

    expect(headers).toBeDefined();
    expect(statusCode).toBe(500);
    expect(JSON.parse(body).message).toStrictEqual("Server error");
  });
});
