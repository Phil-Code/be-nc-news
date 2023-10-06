const db = require('../db/connection')

exports.fetchAllUsers = async ()=>{
    const result = await db.query('SELECT * FROM users;')
    return result.rows
}
exports.fetchUser = async (username)=>{
    if (!/^[a-z]/i.test(username)){
        return Promise.reject({status: 400, msg: 'invalid username'})
    }
    const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username])

    if (!result.rows.length){
        return Promise.reject({status: 404, msg: 'user not found'})
    }
    return result.rows[0]
}