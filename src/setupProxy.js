// const proxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  app.use(createProxyMiddleware('/.netlify/functions/', { 
    target: 'http://localhost:34567/',
    "pathRewrite": {
      "^/\\.netlify/functions": ""
    }
  }));
};