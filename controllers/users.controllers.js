const { fetchAllUsers, fetchUser } = require("../models/users.models")

exports.getAllUsers = async (req, res, next) =>{
    try {
        const users = await fetchAllUsers();
        res.status(200).send({users})
    } catch(err){
        next(err)
    }
}
exports.getUserByUsername = async (req, res, next)=>{
    try {
        const username = req.params.username
        const user = await fetchUser(username)
        res.status(200).send({user})
    } catch(err){
        next(err)
    }
}