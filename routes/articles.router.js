const articlesRouter = require('express').Router()
const {getArticles, getArticleById, getArticleComments, patchArticle, postArticleComment, postArticle, deleteArticle} = require('../controllers/articles.controllers')

articlesRouter.route('/')
.get(getArticles)
.post(postArticle)

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)
.delete(deleteArticle)

articlesRouter.route('/:article_id/comments')
.get(getArticleComments)
.post(postArticleComment)

module.exports = articlesRouter