"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _config = _interopRequireDefault(require("config"));

var _swaggerConfig = _interopRequireDefault(require("./swagger-config"));

var _api = _interopRequireDefault(require("./api"));

var _lodash = _interopRequireDefault(require("lodash"));

var _response = require("./utilities/response");

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _scheduler = _interopRequireDefault(require("./utilities/scheduler"));

var _socketService = _interopRequireDefault(require("./socket/socketService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: app.js
 * @description: It Contain server setup function.
 * @author: Aditi Goel
 */
//import * as DB from './db';
const {
  port
} = _config.default.get('app');

const imagePath = "./public/uploads/images/";

const {
  auth,
  name,
  host,
  username,
  password,
  dbport
} = _config.default.get('db');

const fs = require('fs');

global._ = _lodash.default;
const app = (0, _express.default)();
const PORT = 3288;
const databaseUrl = auth ? `mongodb://${username}:${password}@${host}:${dbport}/${name}` : `mongodb://${host}/${name}`;

const http = require('http');

const https = require('https');

app.use((0, _expressFileupload.default)()); // Access-Control-Allow-Origin

app.use((0, _cors.default)()); // parse application/x-www-form-urlencoded

app.use(_bodyParser.default.json({
  limit: "50mb"
}));
app.use(_bodyParser.default.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
})); // parse application/json

app.use(_bodyParser.default.json());
/*********** Swagger UI setup ********************/

app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swaggerConfig.default));
/*********** All Routes ********************/

app.use('/api/v1', _api.default);
app.use("/uploads", _express.default.static("public/uploads"));
app.use("/images", _express.default.static("public/images"));
app.use("/img", _express.default.static("public/img"));
app.use("/", _express.default.static("build"));
app.use(_express.default.static(_path.default.join(__dirname, "public"))); // After your routes add a standard express error handler. This will be passed the Joi
// error, plus an extra "type" field so we can tell what type of validation failed

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json((0, _response.failAction)(err.error.message.toString().replace(/[\""]+/g, "")));
  } else {
    // pass on to another error handler
    next(err);
  }
}); // Run static setup

app.use(_express.default.static(__dirname + '/'));
app.get('/*', function (req, res) {
  return res.sendFile(_path.default.join(__dirname + '/build', 'index.html'));
}); // app.use(express.static(path.join(__dirname, 'views/dist')));
// app.get('*', function (req, res) {
//     return res.sendFile(path.join(__dirname, 'views/dist', 'index.html'));
// });
// check mongose connection
//DB.connection();

_mongoose.default.connect(databaseUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

console.log(databaseUrl); //Without SSL

const server = http.createServer(app); //With SSL
// const options = {
//     key: require('fs').readFileSync('/home/jenkins/SSL/ss.key', 'utf8'),
//     cert: require('fs').readFileSync('/home/jenkins/SSL/ss.crt', 'utf8')
//   };
//  const server = https.createServer(options, app);
// starting the server

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
(0, _socketService.default)(server);