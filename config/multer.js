import multer from "multer";
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination : './uploads/',
    filename : ( req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})

// Initial upload
const upload = multer({
    storage,
    limits: { fileSize : 1000000}, //1MB
    fileFilter : ( req, file, cb)=>{
        checkFileType(file,cb)
    }
})

// Check file type
function checkFileType(file, cb) {
    const fileTypes = /jpg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }else{
        cb('Error: image only')
    }
}

export default upload;