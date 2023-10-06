const { fetchArticleComments, fetchArticleById, fetchArticles, updateArticle,  insertArticleComment, insertArticle  } = require("../models/articles.models");


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
    const topic = req.query.topic
    const sortBy = req.query.sort_by
    const order = req.query.order
    const limit = req.query.limit
    const p = req.query.p
    try {
        const articles = await fetchArticles(sortBy, order, topic, limit, p);
        res.status(200).send({articles})
    } catch(err) {
        next(err)
    }
}

exports.patchArticle = async (req, res, next) =>{

    try {
        const id = req.params.article_id;
        const newVotes = req.body.inc_votes
        const article = await updateArticle(newVotes, id)
        res.status(200).send({article})
    } catch(err){
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

exports.postArticle = async (req, res, next) =>{
    const newArticle = req.body;
    try {
        const article = await insertArticle(newArticle)
        res.status(200).send({article})
    } catch(err){
        next(err)
    }
}