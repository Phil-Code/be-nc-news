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
});

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

