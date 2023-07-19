import jwt from 'jsonwebtoken'

const auth = {}

auth.tokenData = (req) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return null;

    const token = authorizationHeader.split(' ')[1];
    let result = null;
    jwt.verify(token, process.env.ACCESS_KEY, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            result = data;
        }
    })
    return result;
}

auth.authenUser = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) return res.sendStatus(401)

    const token = authorizationHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    let key = process.env.ACCESS_KEY
    jwt.verify(token, key, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403)
        }
        req.user = { ...data }
        next()
    })
}

//Chức vụ Admin
auth.authenAdmin = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_KEY, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        if (data.id_role != 2) return res.sendStatus(403);
        next();
    })
}
auth.isLogin = (socket, next) => {

    console.log(socket.request.query)
    next();
    try {
        var token = socket.request.query.token;
    } catch (error) {
        next(new Error("not authorized", error));
    }

}

module.exports = auth