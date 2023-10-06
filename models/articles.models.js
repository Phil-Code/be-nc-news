const format = require('pg-format');
const db = require('../db/connection');
const { checkExists } = require('../helpers');

exports.fetchArticleComments = async (id, limit, p) =>{
    
    let queryString = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC `

    if (/[0-9]/g.test(limit) && /[0-9]/g.test(p)){
        queryString += `LIMIT ${limit} OFFSET ${p * limit - limit}`
    }
    const result = await db.query(queryString, [id])
    
    if (!result.rows.length){
        await checkExists('articles', 'article_id', id)
    } 
    return result.rows
}
exports.fetchArticleById = async (id) =>{
    const response = await db.query(`
    SELECT articles.article_id, 
 title, topic, 
 articles.author, 
 articles.body, 
 articles.created_at, 
 articles.votes, 
 article_img_url, 
 COUNT(comments.article_id) AS comment_count
 FROM articles
 LEFT JOIN comments on 
 articles.article_id = comments.article_id
 WHERE articles.article_id = $1
 GROUP BY articles.article_id;
    `, [id]);
    if (!response.rows.length){
        return Promise.reject({status: 404, msg: '404: resource not found'})
    } else {
        return response.rows[0]
    }
}
exports.fetchArticles = async (sortBy, order, topic, limit = 10, p) =>{
    const greenlist = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes']
    
    if (!greenlist.includes(sortBy)){
        sortBy = 'created_at'
    } 
    if (order !== 'asc'){
        order = 'desc'
    } 
    
    const queries = [];
    let queryString = ` 
    SELECT articles.author AS author, 
    title, 
    articles.article_id AS article_id,
    COUNT(comments.article_id) AS comment_count, 
    topic, 
    articles.created_at AS created_at, 
    articles.votes AS votes, 
    article_img_url,
    count(*) over() AS total_count
    FROM articles
    LEFT JOIN comments
    on articles.article_id = comments.article_id
     `
    if (topic){
        queryString += `WHERE topic = $1 `
        queries.push(topic)
    } 
   
    queryString += `GROUP BY articles.article_id ORDER BY ${sortBy} ${order} `

    if (/[0-9]/g.test(limit) && /[0-9]/g.test(p)){
        queryString += `LIMIT ${limit} OFFSET ${p * limit - limit}`
    }
    const result = await db.query(queryString, queries)

    if (!result.rows.length){
        await checkExists('topics', 'slug', topic)
    }
    return result.rows;
}
exports.updateArticle = async (newVotes, id) =>{
    let result;
   
    if (!newVotes){
        result = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    } else {
        result = await db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        returning *;
    `, [newVotes, id])
    }
    if (!result.rows.length){
        await checkExists('articles', 'article_id', id)
    }
    return result.rows[0]
}

exports.insertArticleComment = async (comment, id) =>{

    if (!comment.body){
        return Promise.reject({status: 400, msg: 'bad request'})
    }

    await checkExists('articles', 'article_id', id);

    const result = await db.query(`
    INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;
    `, [comment.username, comment.body, id])
    return result.rows[0]
}
exports.insertArticle = async (article) =>{
    
    if (!article.article_img_url){
        article.article_img_url = 'https://images.pexels.com/photos/img'
    }
   
    const result = await db.query(`
        INSERT INTO articles
        (title, topic, author, body, article_img_url)
        VALUES 
        ($1, $2, $3, $4, $5) returning *;
    `, [article.title, article.topic, article.author, article.body, article.article_img_url])
    
    return result.rows[0]
}
