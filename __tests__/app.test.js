const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");


beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('testing correct access to /api/topics', () => {
    test('200: responds with an array of topic objects, each with properties of slug and description', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            const { topics } = body;
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
            expect(topic).toMatchObject({
                description: expect.any(String),
                slug: expect.any(String),
            });
            });
        });
    });
    test('404: Not Found', () => {
        return request(app)
        .get("/api/endpoint-does-not-exist")
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Not Found')
            })
        })
});


