import { createProxyMiddleware } from "http-proxy-middleware";

const chatProxy = createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,

    changeOrigin: true,

    pathRewrite: {
        "^/api/chats": ""
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

export default chatProxy;