import { bucket } from "./firebase"

export default function saveImg(req,res) {
    const filename= req.files[0].originalname
    const blob = bucket.file(req.files[0].originalname)

    const blobWriter = blob.createWriteStream({
        metadata: {
            contentType: req.files[0].mimetype
        }
    })
    blobWriter.on('error', (err) => {
        console.log(err)
    })

    blobWriter.on('finish', (data) => {
       
    })

    blobWriter.end(req.files[0].buffer)
    return filename
}
