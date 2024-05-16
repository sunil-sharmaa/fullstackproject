const jwt = require('jsonwebtoken');
const jwt_secretkey = "jai jai shree ram";

function verifytoken(req, res, next) {

    const token = req.headers["authentication"]

    if (token) {    
        const data = jwt.verify(token, jwt_secretkey)
        req.user = data.user
        next();
    }
    else {
        res.status(404).json({error:"token is not received"});
    }
}
module.exports = verifytoken