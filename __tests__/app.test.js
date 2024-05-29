const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const fs = require("fs/promises")


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
            expect(body.msg).toBe('Not Found')
            })
        })
});

describe('Returning all available endpoints in a JSON object on the endpoint /api', () => {
    test('200: responds with an accurate JSON object', () => {
        return fs.readFile("endpoints.json", "utf8").then((fileContents) => {
            const endpoints = JSON.parse(fileContents);
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
            expect(body).toEqual(endpoints);
        });
    });
});
});

describe('returns a chosen article by id', () => {
    test('200: OK', () => {
        return request(app)
        .get("/api/articles?article_id=2")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: 2,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
            });
        });
    });
    test('Returns 400: Bad Request when article id requested is invalid or not entered', () => {
        return request(app)
        .get("/api/articles?article_id=NaN")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            })
        })
    test('Returns 400: Bad Request when article id requested is invalid or not entered', () => {
        return request(app)
        .get("/api/articles?article_id=")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            })
        })
    test('Returns 404: Not Found when user searches for an article id that does not exist', () => {
        return request(app)
        .get("/api/articles?article_id=9999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
            })
        })
});


