const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const { getArticleComments, getArticles, getArticleById, postArticleComment, patchArticle  } = require('./controllers/articles.controllers');
const { handleSQLErrors, handleCustomErrors, handleServerErrors } = require('./controllers/error.controllers');
const { deleteCommentById } = require('./controllers/comments.controllers');

const app = express();
app.use(express.json());

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)

app.patch('/api/articles/:article_id', patchArticle)
app.post('/api/articles/:article_id/comments', postArticleComment)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.all('/*', (req, res, next)=>{
    next({status: 404, msg: 'resource not found'})
})

app.use(handleSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)


module.exports = app;