require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const { NODE_ENV, RENDER_URL, PORT } = process.env;
const forProd = NODE_ENV === 'production';
const host = forProd ? RENDER_URL : `localhost:${PORT || 8080}`;

const htmlInDescription = `<p>Final assignment for CSE341<p>
    <p>Authentication links: </p>
    <a href='/login'>Login</a><br />
    <a href='/logout'>Logout</a>`;

const doc = {
    info: {
        title: 'Clothing Store API',
        description: htmlInDescription
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
        },
        CreateOrder: {
            userId: '650c5812c06bc031e32200a2',
            productIds: '650c5812c06bc031e32200a4',
            total: 49.99,
            orderDate: '2024-06-02',
            status: 'Processing',
            shippingAddress: '452 Oak St, Othercitytown, USA'
        },
        UpdateOrder: {
            userId: '650c5812c06bc031e32200a3',
            productIds: '650c5812c06bc031e32200a4',
            total: 49.99,
            orderDate: '2024-06-02',
            status: 'Processing',
            shippingAddress: '452 Oak St, Othercitytown, USA'
        },
        CreateReview: {
            userId: '650c5812c06bc031e32200a2',
            productId: '650c5812c06bc031e32200a4',
            rating: 4,
            comment: 'Jeans fit well but a bit too long.',
            reviewDate: '2024-06-06'
        },
        UpdateReview: {
            userId: '650c5812c06bc031e32200a2',
            productId: '650c5812c06bc031e32200a4',
            rating: 10,
            comment: 'Jeans fit well but a bit too long.',
            reviewDate: '2024-06-06'
        }
    }
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
