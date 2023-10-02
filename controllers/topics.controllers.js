const { fetchTopics, fetchArticleById } = require("../models/topics.models")

exports.getTopics = async (req, res, next) =>{
    const topics = await fetchTopics()
    res.status(200).send({topics})
}

exports.getArticleById = async (req, res, next) =>{
    const id = req.params.article_id

    try {
        const article = await fetchArticleById(id);
        res.status(200).send({article})
    } catch(err){
        if (err.code === '22P02'){
            next({status: 400, msg: 'invalid id type'})
        } else {
            next(err)
        }
    }
}