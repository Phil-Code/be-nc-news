const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const testEndpoints = require('../endpoints.json')
const db = require('../db/connection')

beforeEach(()=> seed(data)
);
afterAll(() => db.end())

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
})