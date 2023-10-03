const { fetchApis } = require("../models/api.models");


exports.getApi = async (req, res, next) =>{
    const endpoints = await fetchApis();
    res.status(200).send({endpoints})
}