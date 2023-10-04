const db = require('../db/connection');
const { checkExists } = require('../helpers');

exports.fetchArticleComments = async (id) =>{
    const result = await db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `, [id])
    if (!result.rows.length){
        await checkExists('articles', 'article_id', id)
    } 
    return result.rows
}
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
exports.fetchArticles = async () =>{
    const result = await db.query(`
        SELECT articles.author AS author, 
        title, 
        articles.article_id AS article_id,
        COUNT(comments.article_id) AS comment_count, 
        topic, 
        articles.created_at AS created_at, 
        articles.votes AS votes, 
        article_img_url
        FROM articles
        LEFT JOIN comments
        on articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
        ;
    `)
    return result.rows;
}
exports.updateArticle = async (newVotes, id) =>{
    if (!newVotes){
        return Promise.reject({status: 400, msg: 'bad request'})
    };

    const result = await db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        returning *;
    `, [newVotes, id])
    
    if (!result.rows.length){
        await checkExists('articles', 'article_id', id)
    }

    return result.rows[0]
}
