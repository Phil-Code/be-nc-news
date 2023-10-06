const db = require('../db/connection');

exports.fetchTopics = async() => {
    const result = db.query(`
    SELECT * from topics;
    `)
    return (await result).rows;
}
exports.insertTopic = async (topic) =>{
    if (!topic.slug || !topic.description){
        return Promise.reject({status: 400, msg: 'bad request'})
    }
    const result = await db.query(`
        INSERT INTO topics
        (slug, description)
        VALUES
        ($1, $2)
        RETURNING *
    `, [topic.slug, topic.description])
    
    return result.rows[0]
}
