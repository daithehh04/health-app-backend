var path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({

});

const upload = multer({
     storage: storage,
     fileFilter: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          console.log(ext);
          if (ext !== '.mp4' && ext !== '.mkv' && ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png' && ext !== ".avif") {
               cb(new Error('File type not supported'), false);
               return;
          }
          cb(null, true);
     }
});

module.exports = upload;