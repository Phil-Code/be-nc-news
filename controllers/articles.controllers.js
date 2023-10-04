const { fetchArticleComments, fetchArticleById, fetchArticles, updateArticle } = require("../models/articles.models");

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
    try {
        const articles = await fetchArticles();
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