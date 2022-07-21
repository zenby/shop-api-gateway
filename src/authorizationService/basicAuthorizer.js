export const handler = async (event, _ctx, cb) => {
  try {
    const token = event.headers.Authorization.replace("Basic ", "");
    const [username, password] = Buffer.from(token, "base64").toString("utf-8").split(":");

    const storedPassword = process.env[username];
    const shouldGiveAccess = Boolean(storedPassword) && storedPassword === password;
    const policy = generatePolicy(token, event.methodArn, shouldGiveAccess);

    cb(null, policy);
  } catch (e) {
    console.log(e);
    cb("Unauthorized");
  }
};

const generatePolicy = (principalId, resource, shouldGiveAccess) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: shouldGiveAccess ? "Allow" : "Deny",
        Resource: resource,
      },
    ],
  },
});
