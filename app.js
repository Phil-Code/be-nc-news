const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const app = express();

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.all('/*', (req, res, next)=>{
    next({status: 404, msg: 'resource not found'})
})

app.use((err, req, res, next)=>{
    if (err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        res.status(500).send({msg: 'internal server error'})
    }
})


module.exports = app;