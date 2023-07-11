import { bucket } from "./firebase"
import { v4 as uuidv4 } from 'uuid';
export default function saveImg(req,res) {
    const filename= uuidv4()
    const blob = bucket.file(filename)

    const blobWriter = blob.createWriteStream({
        metadata: {
            contentType: req.files[0].mimetype
        }
    })
    blobWriter.on('error', (err) => {
        console.log(err)
    })

    blobWriter.on('finish', (data) => {
       console.log('uploaded')
    })

    blobWriter.end(req.files[0].buffer)
    return filename
}
