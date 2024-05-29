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

describe('GET /api/articles/:article_id', () => { 
    test('200 - returns a chosen article by id', () => { 
        return request(app) 
        .get('/api/articles/2')
        .expect(200) 
        .then(({ body }) => { 
            expect(body.article).toMatchObject(({ 
                    author: expect.any(String), 
                    title: expect.any(String), 
                    article_id: 2, 
                    body: expect.any(String), 
                    topic: expect.any(String), 
                    created_at: expect.any(String), 
                    votes: expect.any(Number), 
                    article_img_url: expect.any(String), 
                }) ); 
            }); 
        }); 

    test('Returns 400: Bad Request when article id requested is invalid or not entered', () => { 
        return request(app)
        .get('/api/articles/doesNotExist')
        .expect(400)
        .then(({ body }) => { 
            expect(body.msg).toBe('Bad Request'); 
        }); 
    }); 
    test('Returns 404: Not Found when user searches for an article id that does not exist', () => { 
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body }) => { 
            expect(body.msg).toBe('Not Found'); 
        }); 
    }); 
});

describe('testing correct access to /api/articles', () => {
    test('200: responds with an array of all available article objects', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => { 
        expect(body.articles).toHaveLength(13); 
        body.articles.forEach((article) => { 
            expect(article).toEqual( expect.objectContaining({ 
                author: expect.any(String), 
                title: expect.any(String), 
                article_id: expect.any(Number), 
                topic: expect.any(String), 
                created_at: expect.any(String), 
                votes: expect.any(Number), 
                article_img_url: expect.any(String), 
                comment_count: expect.any(String), 
            }) ); 
            expect(article).not.toHaveProperty("body"); 
        }); 
    }); 
});
    test('Responds with 404: Not Found when a user inputs incorrect endpoint', () => {
    return request(app)
    .get("/api/endpoint-does-not-exist")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe('Not Found')
        })
    })
});

describe('GET /api/articles/:article_id/comments', () => {
    test('200 - returns all associated comments from a specific article when searched for by article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => { 
        expect(body.comments).toBeInstanceOf(Array); 
        expect(body.comments).toBeSortedBy('created_at', {descending: true});
        body.comments.forEach((comment) => { 
            expect(comment).toEqual( expect.objectContaining({ 
                comment_id: expect.any(Number), 
                votes: expect.any(Number), 
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String), 
                article_id: expect.any(Number), 
                }) 
            ); 
        }); 
    }); 
});
    test('Responds with 404: Not Found when a user inputs incorrect endpoint', () => {
    return request(app)
    .get("/api/endpoint-does-not-exist")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe('Not Found')
        })
    })
    test('Returns 404: Not Found when user searches for an article id that does not exist', () => { 
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => { 
            expect(body.msg).toBe('Not Found'); 
        }); 
    }); 
});


