const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
//const mongodb = require('../__mocks__/database');
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
app.use('/', indexRoutes)

//manually mock the authenticate
jest.mock('../middleware/authenticate', () => ({
    isAuthenticated: (req, res, next) => {
        next();
    }
}));

let dbClient;

beforeAll(async () => {
    const { initDb } = require('../__mocks__/database')
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

    // Seed the database with test data
    const usersCollection = dbClient.db().collection('users');
    const user = {
        fName: 'Bill',
        lName: 'Gates',
        email: 'billgates@test.com',
        phone: '123-456-7890',
        address: '123 Microsoft Way',
        role: 'admin',
        githubId: 12345678,
    };

    await usersCollection.insertOne(user);
    //const testResult = await usersCollection.find().toArray();
});

describe('GET /users', () => {
    it('should return all users', async () => {
        const response = await request(app).get('/users').expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                fName: 'Bill',
                lName: 'Gates',
                email: 'billgates@test.com',
                phone: '123-456-7890',
                address: '123 Microsoft Way',
                role: 'admin',
                githubId: 12345678,
            }),
        ]));

    });
});

//kill everything
afterAll(async () => {
    if (dbClient) {
        await dbClient.close();
    }
});