const { fetchArticleComments } = require("../models/articles.models");

exports.getArticleComments = async (req, res, next) =>{
    const id = req.params.article_id;
    const comments = await fetchArticleComments(id);
    res.status(200).send({comments})
}