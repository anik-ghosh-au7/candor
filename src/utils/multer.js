import multer from 'multer';
import path from 'path';

const memoryStorage = multer.memoryStorage();

const cloudUpload = multer({
    storage: memoryStorage,
    fileFilter: (req, file, callback) => {
        let ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(res.end('Only images are allowed'), null)
        }
        callback(null, true);
    }
}).single('image');

module.exports = cloudUpload;