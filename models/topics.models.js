const db = require('../db/connection');
const {readFile} = require('fs/promises')


exports.fetchTopics = async() => {
    const result = db.query(`
    SELECT * from topics;
    `)
    return (await result).rows;
}
exports.fetchApis = async () => {
    const endpoints = await readFile('./endpoints.json')
    const parsedEndpoints = JSON.parse(endpoints)
    return parsedEndpoints
    
}