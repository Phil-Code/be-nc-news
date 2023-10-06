const apiRouter = require('express').Router()
const {getApi} = require('../controllers/api.controllers')
const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')
const topicsRouter = require('./topics.router')
const usersRouter = require('./users.router')

apiRouter.get('/', getApi)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)

apiRouter.all('/*', (req, res, next)=>{
    next({status: 404, msg: 'resource not found'})
})


module.exports = apiRouter