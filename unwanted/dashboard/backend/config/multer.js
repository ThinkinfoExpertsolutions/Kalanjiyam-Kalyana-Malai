import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'horoscopeImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 3 }, 
  ]);

export default upload;
