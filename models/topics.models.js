const db = require('../db/connection');

exports.fetchTopics = async() => {
    const result = db.query(`
    SELECT * from topics;
    `)
    return (await result).rows;
}
