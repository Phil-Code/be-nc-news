const db = require('../db/connection')
const { checkExists } = require('../helpers')

exports.removeCommentById = async (id) =>{

    await checkExists('comments', 'comment_id', id);
    await db.query(`
        DELETE FROM comments WHERE comment_id = $1;
    `, [id])
}