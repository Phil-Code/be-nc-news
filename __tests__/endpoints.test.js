const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const testEndpoints = require('../endpoints.json')
const db = require('../db/connection')

beforeEach(()=> seed(data))
afterAll(()=> db.end())

describe('GET/api/topics', ()=>{
    test('responds with a 200 status and sends an array of topic objects to the client', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const topics = body.topics;
            expect(topics.length).toBe(3);
            topics.forEach((topic)=>{
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
})
describe('GET/api/articles', ()=>{
    test('send a 200 status code and an array of all article objects to the client', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            const articles = body.articles;
            expect(articles.length).toBe(13)
            articles.forEach((article)=>{
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.comment_count).toBe('string')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
            })
        })
    })
    test('the array of articles are sorted by date created in descending order by default', ()=>{
        return request(app)
        .get('/api/articles')
        .then(({body})=>{
            const articles = body.articles;
            expect(articles).toBeSortedBy('created_at', {descending: true})
        })
    }) 
    test('the comment_count column correctly counts the number of comments from the columns table matching the article id', ()=>{
        return request(app)
        .get('/api/articles')
        .then(({body})=>{
            const articles = body.articles;
            expect(articles[0].comment_count).toBe('2')
        })
    })
});

describe('GET/api', ()=>{
    test('responds with 200 status code and an object describing all available endpoints', ()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            const endpoints = body.endpoints;
            const endpointsKeys = Object.keys(body.endpoints)
            const testEndpointsKeys = Object.keys(testEndpoints)
            expect(endpointsKeys).toEqual(testEndpointsKeys)
            endpointsKeys.forEach((key)=>{
                expect(typeof endpoints[key].description).toBe('string')
                expect(Array.isArray(endpoints[key].queries)).toBe(true)
                expect(typeof endpoints[key].exampleResponse).toBe('object')
            })
        })
    })
})
describe('GET/api/articles/:article_id', ()=>{
    test('returns a 200 status code and the requested article object to the client', ()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
            const article= body.article
            const testArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            expect(article).toMatchObject(testArticle)
        })
          
    })
    test('returns 404 status code and resource not found message when client enters valid but non-existent id', ()=>{
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('404: resource not found')
        })
    })
    test('returns 400 status code and bad request message when client enters an invalid id type', ()=>{
        return request(app)
        .get('/api/articles/invalid_input')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
    })
});
describe('GET/api/articles/3/comments', ()=>{
    test('sends 200 status code and an array of comments for the selcted article', ()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body})=>{
            const {comments} = body;
            expect(comments.length).toBe(2)
            const sampleComment = {
                comment_id: 11,
                body: "Ambidextrous marsupial",
                votes: 0,
                author: "icellusedkars",
                article_id: 3,
                created_at: "2020-09-19T23:10:00.000Z",
              }
            expect(comments[0]).toMatchObject(sampleComment)
        })
    })
    test('comments are sorted in date order, the most recent first', ()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .then(({body})=>{
            const {comments} = body
            expect(comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('sends 200 status code and an empty array when client requests an existing article with no related comments', ()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body})=>{
            const comments = body.comments;
            expect(comments.length).toBe(0)
        })
    })
    test('sends 404 status code and "resource not found" message when client requests a valid but non-existent article', ()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('resource not found')
        })
    })
    test('sends 400 status code and "bad request" message when client requests an article with an invalid id type', ()=>{
        return request(app)
        .get('/api/articles/invalid_request/comments')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
    })
});

