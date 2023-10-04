const { fetchArticleById, fetchArticles, fetchArticleComments, insertArticleComment } = require("../models/articles.models");

exports.getArticleComments = async (req, res, next) =>{
    const id = req.params.article_id;
    try {
        const comments = await fetchArticleComments(id);
        res.status(200).send({comments})
    } catch (err){
        next(err)
    }
}    

exports.getArticleById = async (req, res, next) =>{
    const id = req.params.article_id
    try {
        const article = await fetchArticleById(id);
        res.status(200).send({article})
    } catch(err) {
        next(err)
    }
}

exports.getArticles = async (req, res, next) =>{
    const topic = req.query.topic;
    try {
        const articles = await fetchArticles(topic);
        res.status(200).send({articles})
    } catch(err) {
        next(err)
    }
}
exports.postArticleComment = async (req, res, next) =>{
    try {
        const id = req.params.article_id;
        const comment = req.body;
    
        const postedComment = await insertArticleComment(comment, id)
        res.status(201).send({postedComment})
    } catch (err){
        next(err)
    }
}