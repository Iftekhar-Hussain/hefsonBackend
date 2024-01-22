/*
 * @file: app.js
 * @description: It Contain server setup function.
 * @author: Aditi Goel
 */
import express from 'express';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import config from 'config';
//import * as DB from './db';
import SwaggerJsDocs from './swagger-config';
import api from './api';
import lodash from "lodash";
import { failAction } from './utilities/response';
const { port } = config.get('app');
import fileUpload from "express-fileupload";
const imagePath = "./public/uploads/images/";
import scheduler from './utilities/scheduler';
import SocketService from "./socket/socketService";
const { auth, name, host, username, password, dbport } = config.get('db');
const fs = require('fs');

global._ = lodash;
const app = express();

const PORT = 3288;
const databaseUrl = auth ? `mongodb://${username}:${password}@${host}:${dbport}/${name}` : `mongodb://${host}/${name}`;

const http = require('http');
const https = require('https');
app.use(fileUpload());
// Access-Control-Allow-Origin
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
// parse application/json
app.use(bodyParser.json());
/*********** Swagger UI setup ********************/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerJsDocs));
/*********** All Routes ********************/
app.use('/api/v1', api);

app.use("/uploads", express.static("public/uploads"));
app.use("/images", express.static("public/images"));
app.use("/img", express.static("public/img"));
app.use("/", express.static("build"));


app.use(express.static(path.join(__dirname, "public")));
// After your routes add a standard express error handler. This will be passed the Joi
// error, plus an extra "type" field so we can tell what type of validation failed
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        res.status(400).json(failAction(err.error.message.toString().replace(/[\""]+/g, "")));
    } else {
        // pass on to another error handler
        next(err);
    }
});
// Run static setup
app.use(express.static(__dirname + '/'));
app.get('/*', function (req, res) {
    return res.sendFile(path.join(__dirname + '/build', 'index.html'));
});
// app.use(express.static(path.join(__dirname, 'views/dist')));
// app.get('*', function (req, res) {
//     return res.sendFile(path.join(__dirname, 'views/dist', 'index.html'));
// });
// check mongose connection
//DB.connection();
mongoose.connect(databaseUrl, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
console.log(databaseUrl)
//Without SSL
const server = http.createServer(app);

//With SSL
// const options = {
//     key: require('fs').readFileSync('/home/jenkins/SSL/ss.key', 'utf8'),
//     cert: require('fs').readFileSync('/home/jenkins/SSL/ss.crt', 'utf8')
//   };
//  const server = https.createServer(options, app);


// starting the server
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
SocketService(server);


