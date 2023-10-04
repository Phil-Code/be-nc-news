const db = require('./db/connection')
const format = require('pg-format')

exports.checkExists = async (table, column, value) =>{
    const queryString = format(`
        SELECT * FROM %I WHERE %I = $1; 
        `, table, column);
    const result = await db.query(queryString, [value])

    if (!result.rows.length){
        return Promise.reject({status: 404, msg: 'resource not found'})
}
}
