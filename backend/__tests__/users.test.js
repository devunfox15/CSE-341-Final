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

//switch to this way to mock auth module so we can add other methods later if needed.
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
    });
    describe('GET USER BY ID', () => {
        it('should return single user', async () => {
            const userId = '650c5812c06bc031e32200a1';
            const response = await request(app)
                .get(`/users/${userId}`)
                .expect(200);

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

afterAll(async () => {
    if (dbClient) {
        await dbClient.close();
    }
});
