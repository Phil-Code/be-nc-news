const { removeCommentById, updateComment } = require("../models/comments.models")

exports.deleteCommentById = async (req, res, next) =>{

    try {
        await removeCommentById(req.params.comment_id)
        res.status(204).send()
    } catch(err){
        next(err)
    }
}
exports.patchComment = async (req, res, next ) =>{
    try {
        const id = req.params.comment_id;
        const newVotes = req.body.inc_votes
        const comment = await updateComment(newVotes, id)
        res.status(200).send({comment})
    } catch(err){
        next(err)
    }
}