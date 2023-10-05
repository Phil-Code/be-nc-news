const db = require('../db/connection')

exports.fetchAllUsers = async ()=>{
    const result = await db.query('SELECT * FROM users;')
    return result.rows
}