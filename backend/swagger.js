require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const { ENV, RENDER_URL, PORT } = process.env;
const forProd = ENV === 'production';
const host = forProd ? RENDER_URL : `localhost:${PORT || 8080}`;

const doc = {
    info: {
        title: 'Clothing Store API',
        description: 'Final assignment for CSE341'
    },
    // TODO: Update this
    host: host,
    // TODO: Update this to only https once the host has been decided
    schemes: forProd ? ['https'] : ['http'],
    definitions: {
        CreateUser: {
            fName: 'MyFirstName',
            lName: 'MyLastName',
            email: 'me@example.com',
            phone: '123-456-0911',
            address: '123 My Place',
            role: 'customer'
        },
        UpdateUser: {
            fName: 'MyFirstName',
            lName: 'MyLastName',
            email: 'me@example.com',
            phone: '123-456-0911',
            address: '123 My Place',
            role: 'admin'
        }
    }
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
