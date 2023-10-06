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
    test('filters the returned articles by topic if a topic query is provided', ()=>{
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body})=>{
            const {articles} = body;
            expect(articles.length).toBe(12)
            articles.forEach((article)=>{
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String),
                })
            })

        })
    })
    test('responds with 200 status code and an empty array if no results match a valid filter query', ()=>{
        return request(app)
        .get('/api/articles?topic=dogs')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toEqual([])
        })
    })
    test('responds with 200 status code and an array of all available articles if client submits an invalid query term', ()=>{
        return request(app)
        .get('/api/articles?invalid_query=cats')
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(13)
        })
    })
});
describe('GET/api/articles - sorting queries', ()=>{
    test('articles can be sorted by a valid column, defaulting to a descending sorting order', ()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('article_id', {descending: true})
        })
    })
    test('articles can be sorted in ascending order rather than the default descending order', ()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id&&order=asc&&topic=mitch')
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(12)
            expect(body.articles).toBeSortedBy('article_id', {ascending: true})
        })
    })
    test('an invalid sort query will result in the articles being returned with default sort properties', ()=>{
        return request(app)
        .get('/api/articles?sort_by=invalid_term')
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(13)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
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
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
              }
            expect(article).toMatchObject(testArticle)
        })    
    })
    test('the returned article has a comment_count property correctly showing how many comments reference the article', ()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
            expect(body.article).toMatchObject({ comment_count: '11'})
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
describe('GET/api/articles/:article_id/comments', ()=>{
    test('sends 200 status code and an array of comments for the selcted article', ()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body})=>{
            const {comments} = body;
            expect(comments.length).toBe(2)
            comments.forEach((comment)=>{
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String),
                    })
                )
            })
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
describe('POST/api/articles/:article_id/comments', ()=>{
    test('responds with 201 status code and an object representing the newly posted comment', ()=>{
        const input = {username: 'lurker', body: 'a freshly posted comment'};
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(201)
        .then(({body})=>{
            expect(body.postedComment).toMatchObject({
                author: 'lurker', 
                body: 'a freshly posted comment', 
                article_id: 2, 
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String)
            })
        })
    })
    test('201 and post still successful if additional properties are present, as long as a username and body are sent by the clinet', ()=>{
        const input = {username: 'lurker', body: 'a freshly posted comment', additionalProperty1: 'useless information', additionalProperty2: 'more useless information'};
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(201)
        .then(({body})=>{
            expect(body.postedComment).toMatchObject({
                author: 'lurker', 
                body: 'a freshly posted comment', 
                article_id: 2, 
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String)
            })
        })
    })
    test('responds with 400 and "bad request" message when client attempts to post content with no username or body', ()=>{
        const input = {wrongName: 'lurker', wrongBody: 'a post that will fail'}
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
    })
    test('responds with a 400 and "bad request" message when the client attempts to post to an invalid article id', ()=>{
        const input = {username: 'lurker', body: 'a post that will fail'};
        return request(app)
        .post('/api/articles/invalid_request/comments')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe(('bad request'))
        })
    })
    test('responds with 404 and "resource not found" message when client attempts to post a comment to a valid but non-existent article id', ()=>{
        const input = {username: 'lurker', body: 'a post that will fail'};
        return request(app)
        .post('/api/articles/999/comments')
        .send(input)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('resource not found')
        })
    })  
    test('responds with a 404 status code and "user not found" when the username in the comment object does not exist in the users table', ()=>{
        const input = {username: 'bob', body: 'a post that will fail'}
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('user not found')
        })
    })
})
describe('GET/api/users', ()=>{
    test('responds with a 200 status code and an array of all user objects', ()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            const {users} = body
            expect(users.length).toBe(4)
            users.forEach((user)=>{
                expect(user).toMatchObject({username: expect.any(String), name: expect.any(String), avatar_url: expect.any(String)})
            })
        })
    })
})
describe('GET/api/users/:username', ()=>{
    test('responds with 200 and a user object when client requests an existing user', ()=>{
        return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({body})=>{
            expect(body.user).toMatchObject({
                username: 'lurker',
                name: 'do_nothing',
                avatar_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
              })
        })
    })
    test('responds with 400 and "bad request" when passed an invalid username', ()=>{
        return request(app)
        .get('/api/users/1111')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('invalid username')
        })
    })
    test('responds with 404 and "user not found" when passed a valid username that does not exist', ()=>{
        return request(app)
        .get('/api/users/bob')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('user not found')
        })
    })
})
describe('PATCH/api/articles/:article_id', ()=>{
    test('an article can have its votes property updated and the successfully updated article is returned', () =>{
        const input = {inc_votes : -10};
        return request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(200)
        .then(({body})=>{
            expect(body.article).toMatchObject({
                votes : -10, 
                article_id: 3,
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })
    test('responds with 200 status code and returns the article with no amendments when client sends an object with no inc_votes property', ()=>{
        const input = {wrong_property_name: 100}
        return request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(200)
        .then(({body})=>{
            expect(body.article).toMatchObject({
                votes : 0, 
                article_id: 3,
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })
    test('responds with 400 status code and "bad request" message when client sends an object with an incorrect data type for votes', ()=>{
        const input = {inc_votes: 'one hundred'}
        return request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
    })
    test('responds with 404 status code and "resource not found" message when client attempts to modify an article that has a valid id but that does not exist', ()=>{
        const input = {inc_votes: 100}
        return request(app)
        .patch('/api/articles/999')
        .send(input)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('resource not found')
        })
    })
})
describe('DELETE/api/comments/:comment_id', ()=>{
    test('responds with  204 and no content when comment successfully deleted', ()=>{
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({body})=>{
            expect(body).toEqual({})
        })
    })
    test('responds with 400 and "bad request" when client attempts to delete a comment with an invalid id', ()=>{
        return request(app)
        .delete('/api/comments/invalid_id')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
    })
    test('responds with 404 and "resource not found" when client attempts to delete a comment that does not exist but with a valid id', ()=>{
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('resource not found')
        })
    })
})
describe('PATCH/api/comments/:comment_id', ()=>{
    test('an comment can have its votes property updated and the successfully updated comment is returned', () =>{
        const input = {inc_votes : 10};
        return request(app)
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body})=>{
            expect(body.comment).toMatchObject( {
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 26,
                author: "butter_bridge",
                article_id: 9,
                created_at: expect.any(String)
              })
        })
    })
    test('responds with 200 status code and returns the comment with no amendments when client sends an object with no inc_votes property', ()=>{
        const input = {wrong_property_name: 100}
        return request(app)
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body})=>{
            expect(body.comment).toMatchObject( {
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 16,
                author: "butter_bridge",
                article_id: 9,
                created_at: expect.any(String)
              })
        })
    })
    test('responds with 400 status code and "bad request" message when client sends an object with an incorrect data type for votes', ()=>{
        const input = {inc_votes: 'one hundred'}
        return request(app)
        .patch('/api/comments/1')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
    })
    test('responds with 404 status code and "resource not found" message when client attempts to modify a comment that has a valid id but that does not exist', ()=>{
        const input = {inc_votes: 100}
        return request(app)
        .patch('/api/comments/999')
        .send(input)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('resource not found')
        })
    })
})
