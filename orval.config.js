module.exports = {
  "openid-connect-api-file": {
    input: new URL("/doc", process.env.OPENID_CONNECT_API_URL).href,
    output: {
      target: "./src/apis.ts",
      baseUrl: process.env.OPENID_CONNECT_API_URL,
    },
  },
};
