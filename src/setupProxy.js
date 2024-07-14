const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const target = process.env.NODE_ENV === 'development'
        ? 'http://localhost:4001'
        : 'https://investment-dashboard-egx8.onrender.com';

    app.use(
        '/api',
        createProxyMiddleware({
            target,
            changeOrigin: true,
        })
    );
};
