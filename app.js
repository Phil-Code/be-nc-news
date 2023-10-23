const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const cors = require('cors');
const { handleSQLErrors, handleCustomErrors, handleServerErrors } = require('./controllers/error.controllers');

app.use(cors());

app.use(express.json());
app.use('/api', apiRouter)

app.use(handleSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app;