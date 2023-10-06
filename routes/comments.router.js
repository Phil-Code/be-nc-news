const commentsRouter = require('express').Router()
const {deleteCommentById, patchComment} = require('../controllers/comments.controllers')

commentsRouter.route('/:comment_id')
.delete(deleteCommentById)
.patch(patchComment)

module.exports = commentsRouter