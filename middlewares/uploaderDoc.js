const multer = require("multer");


const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, './assets/docs')
  },
  filename:(req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.originalname}`)
  }
});



exports.upload = multer({storage});
