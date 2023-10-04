const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const { getArticles, getArticleById, postArticleComment } = require('./controllers/articles.controllers');
const { handleSQLErrors, handleCustomErrors, handleServerErrors } = require('./controllers/error.controllers');

const app = express();
app.use(express.json());

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.post('/api/articles/:article_id/comments', postArticleComment)

app.all('/*', (req, res, next)=>{
    next({status: 404, msg: 'resource not found'})
})

app.use(handleSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)


module.exports = app;