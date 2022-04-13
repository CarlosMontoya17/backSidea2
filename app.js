const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const https = require("http");
var pKey = fs.readFileSync('./server.key', 'utf8');
var pCert = fs.readFileSync('./server.crt', 'utf8');
const app = express();

const options = {
    key: pKey,
    cert: pCert
  }
  
https.createServer(options, app).listen(3030);

/*
app.listen(3030, () =>{
    console.log("Server is running");
});*/


app.use(express.json());
app.use(express.urlencoded({extended: false}));

//MW
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: "Server online"})
});


require('./routes/users.routes')(app);
