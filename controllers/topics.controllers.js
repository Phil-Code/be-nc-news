const { fetchTopics, fetchApis } = require("../models/topics.models")

exports.getTopics = async (req, res, next) =>{
    const topics = await fetchTopics()
    res.status(200).send({topics})
}
exports.getApi = async (req, res, next) =>{
    const endpoints = await fetchApis();
    res.status(200).send({endpoints})
}