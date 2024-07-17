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

//manually mock the authenticate
//jest.mock('../middleware/authenticate', () => ({
//    isAuthenticated: (req, res, next) => {
//        next();
//    }
//}));

//switch to this way to mock auth module so we can add other methods later if needed.
jest.mock('../middleware/authenticate');
const auth = require('../middleware/authenticate')
const mockAuth = require('../__mocks__/authenticate')
jest.spyOn(auth, 'isAuthenticated').mockImplementation(mockAuth.isAuthenticated);


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

    // Seed the database with USER data
    const usersCollection = dbClient.db().collection('users');    
    const user = {
        _id: new ObjectId('650c5812c06bc031e32200a1'),
        fName: 'Bill',
        lName: 'Gates',
        email: 'billgates@test.com',
        phone: '123-456-7890',
        address: '123 Microsoft Way',
        role: 'admin',
        githubId: 12345678
    };    
    await usersCollection.insertOne(user);
    //const response = await usersCollection.find().toArray();
    //console.table(response)
    
    // adding an order to the Mock database
    const orderCollection = dbClient.db().collection('orders');
    const order = {
        userId: { $oid: '650c5812c06bc031e32200a1' },
        productIds: [
            { $oid: '650c5812c06bc031e32200a3' },
            { $oid: '650c5812c06bc031e32200a4' }
        ],
        totalPrice: 69.98,
        orderDate: '2024-06-01',
        status: 'Shipped',
        shippingAddress: '123 Main St, Anytown, USA'
    };

    await orderCollection.insertOne(order);

    // Seeding test product data
    const productCollection = dbClient.db().collection('products');
    const product = {
        name: 'T-Shirt',
        description: 'A comfortable cotton t-shirt',
        price: 19.99,
        category: 'Clothing',
        size: 'M',
        color: 'Blue'
    };

    await productCollection.insertOne(product);
});

// Unit Test for Users
describe('GET /users', () => {
    describe('GET ALL USERS', () => {
        it('should return all users', async () => {
            const response = await request(app).get('/users').expect(200);
    
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        fName: 'Bill',
                        lName: 'Gates',
                        email: 'billgates@test.com',
                        phone: '123-456-7890',
                        address: '123 Microsoft Way',
                        role: 'admin',
                        githubId: 12345678
                    })
                ])
            );
        });
    })
    describe('GET USER BY ID', () => {
        it('should return single user', async () => {
            const userId = '650c5812c06bc031e32200a1';
            const response = await request(app).get(`/users/${userId}`).expect(200);
    
            expect(response.body).toEqual(
                expect.objectContaining({
                    _id: userId,
                    fName: 'Bill',
                    lName: 'Gates',
                    email: 'billgates@test.com',
                    phone: '123-456-7890',
                    address: '123 Microsoft Way',
                    role: 'admin',
                    githubId: 12345678
                })
            );
        });
    });
});

// test case for GET /orders/
describe('GET /orders', () => {
    it('should return all orders', async () => {
        const response = await request(app).get('/orders').expect(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                // check that the response body contains an array of orders
                expect.objectContaining({
                    userId: { $oid: '650c5812c06bc031e32200a1' },
                    productIds: [
                        { $oid: '650c5812c06bc031e32200a3' },
                        { $oid: '650c5812c06bc031e32200a4' }
                    ],
                    totalPrice: 69.98,
                    orderDate: '2024-06-01',
                    status: 'Shipped',
                    shippingAddress: '123 Main St, Anytown, USA'
                })
            ])
        );
    });
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
});

afterAll(async () => {
    if (dbClient) {
        await dbClient.close();
    }
});
