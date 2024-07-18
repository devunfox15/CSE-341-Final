const { ObjectId } = require('mongodb');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const indexRoutes = require('../routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use('/', indexRoutes);

jest.mock('../middleware/authenticate');
const auth = require('../middleware/authenticate');
const mockAuth = require('../__mocks__/authenticate');
jest.spyOn(auth, 'isAuthenticated').mockImplementation(
    mockAuth.isAuthenticated
);

//Setup the mongodb in memory for testing
let dbClient;
beforeAll(async () => {
    const { initDb } = require('../__mocks__/database');
    // Initialize DB and start server
    await new Promise((resolve, reject) => {
        initDb((err, client) => {
            if (err) {
                reject(err);
            } else {
                dbClient = client;
                resolve();
            }
        });
    });

    // Seeding test product data
    const productCollection = dbClient.db().collection('products');
    const product = {
        _id: new ObjectId('650c5812c06bc031e32200a3'),
        name: 'T-Shirt',
        description: 'A comfortable cotton t-shirt',
        price: 19.99,
        category: 'Clothing',
        size: 'M',
        color: 'Blue'
    };

    await productCollection.insertOne(product);
});

// Unit test for products GET route
describe('GET /products', () => {
    it('should return all products', async () => {
        const response = await request(app).get('/products').expect(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'T-Shirt',
                    description: 'A comfortable cotton t-shirt',
                    price: 19.99,
                    category: 'Clothing',
                    size: 'M',
                    color: 'Blue'
                })
            ])
        );
    });
    describe('GET products/:id', () => {
        it('should return a single product', async () => {
            const productId = '650c5812c06bc031e32200a3';
            const response = await request(app)
                .get(`/products/${productId}`)
                .expect(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    _id: productId,
                    name: 'T-Shirt',
                    description: 'A comfortable cotton t-shirt',
                    price: 19.99,
                    category: 'Clothing',
                    size: 'M',
                    color: 'Blue'
                })
            );
        });
    });
});

afterAll(async () => {
    if (dbClient) {
        await dbClient.close();
    }
});
