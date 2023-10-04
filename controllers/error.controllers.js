exports.handleSQLErrors = (err, req, res, next) =>{
    if (err.code === '22P02'){
        next({status: 400, msg: 'bad request'})
    }
    else if (err.code === '23503') {
        next({status: 404, msg: 'user not found'})
    }
    else {
        next(err)
    }
}
exports.handleCustomErrors = (err, req, res, next) =>{
    if (err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}
exports.handleServerErrors = (err, req, res, next) =>{
    res.status(500).send({msg: 'internal server error'})
}
