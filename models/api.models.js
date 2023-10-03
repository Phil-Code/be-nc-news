const {readFile} = require('fs/promises')

exports.fetchApis = async () => {
    const endpoints = await readFile('./endpoints.json')
    const parsedEndpoints = JSON.parse(endpoints)
    return parsedEndpoints
    
}