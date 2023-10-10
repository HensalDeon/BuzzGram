import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
}); 

// File validation
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    const error = new Error('Only JPEG and PNG images are allowed!');
    error.status = 400; 
    return cb(error, false);
  }

  // Check file size
  if (file.size > 4 * 1024 * 1024) {
    const error = new Error('File size exceeds the limit of 4MB!');
    error.status = 400;
    error.clientMessage = 'File size exceeds the limit of 4MB!';
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit
  fileFilter: fileFilter,
});

export default upload;
