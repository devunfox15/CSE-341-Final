const swaggerAutogen = require('swagger-autogen')();

const doc = {
   info: {
       title: 'Clothing Store API',
       description: 'Final assignment for CSE341'
   },
   // TODO: Update this
   host: 'localhost:8080',
   // TODO: Update this to only https once the host has been decided
   schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);