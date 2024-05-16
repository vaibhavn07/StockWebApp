const jwt = require('jsonwebtoken');
const JWT_KEY = 'vaibhavn2007@gmail.com';
function loginMiddleware (req,res,next){
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_KEY)
        req.user = data.user;
        
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}
module.exports = loginMiddleware;