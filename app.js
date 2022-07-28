const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
var pKey = fs.readFileSync('./actasalinstante.key');
var pCert = fs.readFileSync('./actasalinstante.crt');
const app = express();
const cron = require("./auto/cron");
// var pgSession = require("express-pg-session")(session);



const port = 3030;

const options = {
    cert: pCert,
    key: pKey
  }



const server = https.createServer(options, app).listen(port, ()=> {
  console.log(`Server is listening on ${port}`);
});


app.use(cors());



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));


// let columnsNames = {
//   session_id: 'sid',
//   session_data: 'sess',
//   expire: 'expires_at'
// };

// let sessionPg = new pgStore({
//   pool : dbConfig.pool,                // Connection pool
//   tableName : 'user_sessions',  // Alternate table name
//   columns: columnsNames          // Alternate column names
// })


// var pgPool = new pg.Pool({
//   host: dbConfig.HOST,
//   database: dbConfig.DB,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   max: dbConfig.pool.max,
//   idleTimeoutMillis: dbConfig.pool.idle,
//   connectionTimeoutMillis: 2000,
// });


// //Session Config
// app.use(session({
//   key: 'AAISessionId',
//   store: new pgSession({
//     pool: pgPool,
//     tableName: 'user_sessions'
//   }),
//   secret: config.secret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge:  1000 * 60 * 30 }
// }));


app.get('/', (req, res) => {
    // res.json({
    //   CapId: "FPWD4LUDJ3R3DA4"
    // });
    req.session.ip = req.ip;
    req.session.view = req.session.view ?++req.session.view: 1;
    res.json(`Welcome to ACTAS AL INSTANTE From EndPoint ${req.session.ip} and view ${req.session.view} times`)
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

const socket = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

socket.on('connection', socket => {
  console.log("Socket!")
});


//Routes
require('./routes/users.routes')(app);
require('./routes/robots.routes')(app, socket);
require('./routes/capturistas.routes')(app);
require('./routes/actas.routes')(app);
require('./routes/actas_req.routes')(app, socket);
require('./routes/rfc_req.routes')(app);
require('./routes/publicidad.routes')(app);
require('./routes/actas_reg.routes')(app);
require('./routes/notifications.routes')(app, socket);

