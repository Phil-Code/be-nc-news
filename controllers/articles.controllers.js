const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = async (req, res, next) =>{
    const id = req.params.article_id

    try {
        const article = await fetchArticleById(id);
        res.status(200).send({article})
    } catch(err){
        next(err)
    }
}