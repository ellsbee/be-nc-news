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

describe('POST /api/articles/:article_id/comments', () => {
    test('201: successfully posts a comment to an article', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'butter_bridge', body: 'Test Comment' })
        .expect(201)
        .then(({ body }) => { 
            expect(body.comment).toBeDefined(); 
            expect(body.comment).toHaveProperty('author', 'butter_bridge');
            expect(body.comment).toHaveProperty('body', 'Test Comment');
            expect(body.comment).toHaveProperty('article_id', 1);
            expect(body.comment).toHaveProperty('comment_id');
            expect(body.comment).toHaveProperty('created_at');
            expect(body.comment).toHaveProperty('votes', 0);
        }); 
    });
    test('responds with 400 if user fails to input a comment (message body is missing)', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ username: 'butter_bridge' })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Field Missing')
            })
    });
    test('responds with 400 if username is not entered', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ comment: 'Test Comment' })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Field Missing')
            })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('200: responds with the updated article', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveProperty('article_id', 1);
                expect(body).toHaveProperty('votes', expect.any(Number));
        });
    });
    test('200: successfully increases vote count of an article', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(( {body} ) => {
                expect(body.article_id).toBe(1);
                expect(body.votes).toBe(101);
        });
    });
    test('200: successfully decreases vote count of an article', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -1 })
            .expect(200)
            .then(( {body} ) => {
                expect(body.article_id).toBe(1);
                expect(body.votes).toBe(99);
        });
    });
    test('400: responds with Bad Request when invalid article_id entered', () => {
        return request(app)
            .patch('/api/articles/invalid')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
        });
    test('404 - responds with Not Found when the article_id entered does not exist', () => {
        return request(app)
            .patch('/api/articles/999999')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found');
            });
        });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('204: successfully deletes a comment by comment_id', () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
            return request(app)
            .get("/api/comments/1")
            .expect(404);
    })
    .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
    });
});
    test('400: responds with Bad Request when invalid comment id is entered', () => {
        return request(app)
            .delete("/api/comments/invalid")
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
    test('404: responds with Not found when comment_id entered does not exist', () => {
        return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found');
            });
    });
});

describe('testing correct access to /api/users', () => {
    test('200: responds with an array of user objects, each with properties of username, name and avatar_url', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            const { users } = body;
            expect(users).toHaveLength(4);
            users.forEach((user) => {
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
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