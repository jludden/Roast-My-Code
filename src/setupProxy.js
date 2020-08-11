// const proxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require("morgan");


module.exports = app => {
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  // app.use(createProxyMiddleware('/.netlify/functions/', { 
  //   target: 'http://localhost:8080/',
  //   "pathRewrite": {
  //     "^/\\.netlify/functions": ""
  //   }
  // }));

  app.use(morgan('combined'));
};