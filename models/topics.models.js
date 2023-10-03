const db = require('../db/connection');

exports.fetchTopics = async() => {
    const result = db.query(`
    SELECT * from topics;
    `)
    return (await result).rows;
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