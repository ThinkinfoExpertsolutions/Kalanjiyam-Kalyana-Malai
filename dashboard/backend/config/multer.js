import multer from 'multer';

const storage = multer.memoryStorage(); // Store images in memory temporarily
const upload = multer({ storage });

export default upload;
