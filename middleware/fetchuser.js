var jwt = require("jsonwebtoken")
const JWT_SECRET = "rohit";
const fetchuser = (req, res, next) => {

    // get user from the jwt token and add id to req object 
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "please authenticate using a valid token" });
    }
    try {
        // console.log(token)
        const data = jwt.verify(token, JWT_SECRET)
        // console.log(data) => { user: { id: '64843afcac96a71357459a96' }, iat: 1686387471 }
        req.user = data.user

        next();
    } catch (error) {
        res.status(401).send({ error: "please authenticate using a valid token" });
    }

}

module.exports = fetchuser;