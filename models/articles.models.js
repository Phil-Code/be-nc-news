const db = require('../db/connection');

exports.fetchArticleComments = async (id) =>{
    const result = await db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `, [id])
    return result.rows
}