import multer from "multer";
import path from "path"
import fs from "fs"
import { ApiError } from "../utils/ApiError.js";
import { MSG_ERROR } from "../constants.js";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const folder = './assets/uploads';
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder);
        }
        cb(null, folder)
    }, 
    filename: (req, file, cb)=>{
        const ext = path.extname(file.originalname)
        const name = `${Date.now()}_${file.fieldname}${ext}`
        cb(null, name)
    }
});

const mimeMap = [];
mimeMap['image/jpg'] = true;
mimeMap['image/jpeg'] = true;

export const upload = multer({
    storage,
    limits: { fileSize: 50*1024*1024 },  // 50 MB
})