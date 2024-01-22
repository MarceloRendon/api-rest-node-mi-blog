const express = require('express');
const ArticuloRouter = require("./ArticuloRouter")


function routerApi(app) {
    const router = express.Router();
    app.use('/api', router);
    router.use('/articulo', ArticuloRouter);

  }
  
  module.exports = routerApi;