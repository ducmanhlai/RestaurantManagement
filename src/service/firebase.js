const admin = require('firebase-admin')
import path from 'path'
// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, '../../thuctap-authen.json')),
    storageBucket: 'thuctap-c9a4b.appspot.com'
})
// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
    bucket
}