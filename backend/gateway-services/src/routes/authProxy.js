import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const authProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,

    changeOrigin: true,

    pathRewrite: {
        "^/api/auth": ""
    },

    on: {
        proxyReq: fixRequestBody
    },

    logLevel: "debug"
});

export default authProxy;