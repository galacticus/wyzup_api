import express from 'express';
import multer from 'multer';
import fs from 'fs';

const uploadFolder = 'uploads'

// Check if the folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
    console.log(`Folder '${uploadFolder}' created successfully.`);
} else {
    console.log(`Folder '${uploadFolder}' already exists.`);
}

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${uploadFolder}/`);
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(409).json({ error: 'No file uploaded' });
        }

        res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


export default router;