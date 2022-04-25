const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const https = require("http");
const cors = require("cors");
var pKey = fs.readFileSync('./server.key', 'utf8');
var pCert = fs.readFileSync('./server.crt', 'utf8');
const app = express();
const cron = require("./auto/cron");

app.use(cors());

const options = {
    key: pKey,
    cert: pCert
  }
  
https.createServer(options, app).listen(3030, ()=> {
  console.log("Server working on port 3030");
});





app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
/*
app.listen(3030, () =>{
    console.log("Server is running");
});*/



app.use(express.json());
app.use(express.urlencoded({extended: false}));

//MW
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ welcome: "S I D E A - 2"})
});

cron.corte();

// const storage = multer.diskStorage({
//   destination:(req, file, cb) => {
//     cb(null, './assets/avatars')
//   },
//   filename:(req, file, cb) => {
//     const ext = file.originalname.split('.').pop();
//     cb(null, `${Date.now()}.${ext}`)
//   }
// });

// const upload = multer({storage});


// app.post('/api/uploadAvatar/', upload.single('avatar'), (req, res) => {
//     res.status(201).json({
//       message: 'Image was upload!'
//     });
// });

//Routes
require('./routes/users.routes')(app);
require('./routes/capturistas.routes')(app);
require('./routes/actas.routes')(app);

