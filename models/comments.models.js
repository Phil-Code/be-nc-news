const db = require('../db/connection')
const { checkExists } = require('../helpers')

exports.removeCommentById = async (id) =>{

    await checkExists('comments', 'comment_id', id);
    await db.query(`
        DELETE FROM comments WHERE comment_id = $1;
    `, [id])
}
exports.updateComment = async (newVotes, id)=>{
    let result;
   
    if (!newVotes){
        result = await db.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    } else {
        result = await db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        returning *;
    `, [newVotes, id])
    }
    if (!result.rows.length){
        await checkExists('comments', 'comment_id', id)
    }
    return result.rows[0]
}