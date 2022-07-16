const multer = require("multer");

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, './assets/robots/captchas')
  },
  filename:(req, file, cb) => {
    cb(null, `${file.originalname}`)
  }
});

exports.upload = multer({storage});

