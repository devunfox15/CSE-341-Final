const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

delete swaggerDocument.paths['/login'];
delete swaggerDocument.paths['/logout'];

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
