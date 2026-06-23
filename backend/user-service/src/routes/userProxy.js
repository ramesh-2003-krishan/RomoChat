import { createProxyMiddleware } from "http-proxy-middleware";

const userProxy = createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,

    changeOrigin: true,

    pathRewrite: {
        "^/api/users": ""
    },

    on: {
        proxyReq: (proxyReq, req) => {

            if (req.user) {
                proxyReq.setHeader(
                    "x-user-id",
                    req.user.userId
                );
            }
        }
    }
});

export default userProxy;