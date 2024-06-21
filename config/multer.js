import multer from "multer";
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination : './public/post/',
    filename : ( req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})

// Initial upload
const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 10 MB
    fileFilter : ( req, file, cb)=>{
        checkFileType(file,cb)
    }
})

// Check file type
function checkFileType(file, cb) {
    // Allowed mime types
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

    // Allowed extensions
    const filetypes = /jpeg|jpg|png/;
    const isValidExtName = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (isValidMimeType && isValidExtName) {
        return cb(null, true);
    }else{
        cb(new Error('Error: Only JPEG and PNG images are allowed!'));
    }
}

export default upload;