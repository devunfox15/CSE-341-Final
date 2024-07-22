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

    // Seeding test review data
    const reviewsCollection = dbClient.db().collection('reviews');
    const review = {
        _id: new ObjectId('650c5812c06bc031e32200a1'),
        userId: { $oid: '650c5812c06bc031e32200a2' },
        productId: '650c5812c06bc031e32200a4',
        rating: 4,
        comment: 'Jeans fit well but a bit too long.',
        reviewDate: '2024-06-06'
    };
    await reviewsCollection.insertOne(review);
});

// test case for GET /reviews/
describe('GET /reviews', () => {
    it('should return all reviews', async () => {
        const response = await request(app).get('/reviews').expect(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                // check that the response body contains an array of reviews
                expect.objectContaining({
                    userId: { $oid: '650c5812c06bc031e32200a2' },
                    productId: '650c5812c06bc031e32200a4',
                    rating: 4,
                    comment: 'Jeans fit well but a bit too long.',
                    reviewDate: '2024-06-06'
                })
            ])
        );
    });
});

describe('GET /reviews/:id', () => {
    it('should return single review', async () => {
        const reviewId = '650c5812c06bc031e32200a1';
        const response = await request(app)
            .get(`/reviews/${reviewId}`)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                _id: reviewId,
                userId: { $oid: '650c5812c06bc031e32200a2' },
                productId: '650c5812c06bc031e32200a4',
                rating: 4,
                comment: 'Jeans fit well but a bit too long.',
                reviewDate: '2024-06-06'
            })
        );
    });
});

afterAll(async () => {
    if (dbClient) {
        await dbClient.close();
    }
});
