const { ObjectId } = require('mongodb');
const request = require('supertest');
const app = require('../server');

// Mock the app.listen method to prevent the server from starting
//this is simply to avoid logging after the tests are done which freaks jest out.  It's to get rid of listening on the port
//grabs the server.js, uses jest.fn to replace the listen module and then returns the modified server.js for code to use.
jest.mock('../server', () => {
    const originalModule = jest.requireActual('../server');
    originalModule.listen = jest.fn(); // Mock the listen method
    return originalModule;
});

// Switch to this way to mock auth module so we can add other methods later if needed.
jest.mock('../middleware/authenticate');
const auth = require('../middleware/authenticate');
const mockAuth = require('../__mocks__/authenticate');
jest.spyOn(auth, 'isAuthenticated').mockImplementation(
    mockAuth.isAuthenticated
);

// Setup the MongoDB in-memory for testing - needed for sessions...
let dbClient;
beforeAll(async () => {
    const { initDb } = require('../__mocks__/database');
    // Initialize DB
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

});

describe('GET /', () => {
    it('should return "Logged Out"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Logged Out');
    });
});

afterAll(async () => {
    if (dbClient) {
        await dbClient.close();
    }
});
