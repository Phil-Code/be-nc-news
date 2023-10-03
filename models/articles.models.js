const db = require('../db/connection');

exports.fetchArticleById = async (id) =>{
    const response = await db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;
    `, [id]);
    if (!response.rows.length){
        return Promise.reject({status: 404, msg: '404: resource not found'})
    } else {
        return response.rows[0]
    }
}
