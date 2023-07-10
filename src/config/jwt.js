import jwt from 'jsonwebtoken'
require('dotenv').config()

const createJWT = (data, type="") => {
    let payload = data;
    let key = process.env.ACCESS_KEY
    let token = null
    let keyRefresh = process.env.REFRESH_KEY
    try {
        token = type.localeCompare('REFRESH')==0 ? jwt.sign(payload, keyRefresh, { expiresIn: '7d' }) : jwt.sign(payload, key, { expiresIn: '5h' });
    } catch (e) {
        console.log(e);
    }
    return token;
}


const verifyJWT = (token, type = "") => {
    let key = process.env.ACCESS_KEY;
    let keyRefresh = process.env.REFRESH_KEY
    let data = null
    try {
        let decoded = type.localeCompare('REFRESH') != 0 ? jwt.verify(token, key) : jwt.verify(token, keyRefresh)
        data = decoded
    } catch (e) {
        console.log(e);
    }
    // console.log(data);
    return data
}


export { createJWT, verifyJWT }
