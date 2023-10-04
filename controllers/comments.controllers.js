const { removeCommentById } = require("../models/comments.models")

exports.deleteCommentById = async (req, res, next) =>{

    try {
        await removeCommentById(req.params.comment_id)
        res.status(204).send()
    } catch(err){
        next(err)
    }
}