const { fetchTopics, insertTopic } = require("../models/topics.models")

exports.getTopics = async (req, res, next) =>{
    const topics = await fetchTopics()
    res.status(200).send({topics})
}
exports.postTopic = async (req, res, next) =>{
    const newTopic = req.body;
    try {
        const topic = await insertTopic(newTopic)
        res.status(201).send({topic})
    } catch(err){
        next(err)
    }
}

