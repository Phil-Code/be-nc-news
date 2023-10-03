const { fetchTopics, fetchArticles } = require("../models/topics.models")

exports.getTopics = async (req, res, next) =>{
    const topics = await fetchTopics()
    res.status(200).send({topics})
}
exports.getArticles = async (req, res, next) =>{
    const articles = await fetchArticles();
    res.status(200).send({articles})
}