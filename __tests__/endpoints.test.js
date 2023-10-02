const app = require('../app')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')

beforeEach(()=> seed(data))



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

describe('GET/api/articles/:article_id', ()=>{
    test('returns a 200 status code and the requested article object to the client', ()=>{
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body})=>{
            const article= body.article
            expect(article.title).toBe('Sony Vaio; or, The Laptop')
            expect(article.topic).toBe('mitch')
            expect(article.author).toBe('icellusedkars')
            expect(typeof article.body).toBe('string')
            expect(typeof article.created_at).toBe('string')
            expect(typeof article.votes).toBe('number')
            expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
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
            expect(body.msg).toBe('invalid id type')
        })
    })
})