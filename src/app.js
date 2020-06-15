const express = require('express');
const config = require('../bin/config.json');
const app = express();
const mysql = require('./mysql2');
const router = express.Router();
const cors = require('cors');

//Rotas
const index = require('./routes/index');

app.use(express.json());
//CORS
app.use((req, res, next) => {
    console.log("Acessou o Middleware!");
    res.header('Access-Control-Allow-Origin: *');
    res.header('Access-Control-Allow-Credentials: true');
    res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
    res.header("Access-Control-Allow-Header", 'Origin, X-Requested-With, X-PINGOTHER, Content-Type, Accept, Authorization');
    app.use(cors());
    next();
    //return res.status(200).send({});
});

//app.use((req, res, next) => {
//    res.header('Acces-Control-Allow-Origin', '*');
//    res.header('Acces-Control-Allow-Header', 
//    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//    if (req.method === 'OPTIONS') {
//        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//        return res.status(200).send({});
//    }

//    next();
//});

app.use('/', index);

module.exports = app;
