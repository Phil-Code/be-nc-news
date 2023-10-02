const app = require('../app')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')

beforeEach(()=>{
    seed(data)
});

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