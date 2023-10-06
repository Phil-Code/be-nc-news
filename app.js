const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { handleSQLErrors, handleCustomErrors, handleServerErrors } = require('./controllers/error.controllers');

app.use(express.json());
app.use('/api', apiRouter)

app.use(handleSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app;