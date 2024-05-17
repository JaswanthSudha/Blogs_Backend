const jwt = require("jsonwebtoken")
const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json("You are not Authenicated")
    }
    jwt.verify(token, process.env.SECRET, async (err, data) => {
        if (err) {
            return res.status(403).json("UnAuthorized User");
        }
        req.userId = data.id
        next()
    })
}
module.exports = verifyToken