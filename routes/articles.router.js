const articlesRouter = require('express').Router()
const {getArticles, getArticleById, getArticleComments, patchArticle, postArticleComment} = require('../controllers/articles.controllers')

articlesRouter.get('/', getArticles)

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)

articlesRouter.route('/:article_id/comments')
.get(getArticleComments)
.post(postArticleComment)

module.exports = articlesRouter