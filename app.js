const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const { getArticleComments, getArticles, getArticleById  } = require('./controllers/articles.controllers');
const { handleSQLErrors, handleCustomErrors, handleServerErrors } = require('./controllers/error.controllers');

const app = express();

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)

app.all('/*', (req, res, next)=>{
    next({status: 404, msg: 'resource not found'})
})

app.use(handleSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)


module.exports = app;