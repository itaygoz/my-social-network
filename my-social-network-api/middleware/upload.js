const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 3145728, // 3 MB upload limitation
  },
  fileFilter: (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Error: Only .png, .jpg and .jpeg .gif format allowed!'));
    }
  }
});
