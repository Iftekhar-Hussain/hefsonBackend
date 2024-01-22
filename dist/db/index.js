"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connection = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It Contain db setup function.
 * @author: Aditi Goel
 */
// const { auth, name, host, username, password, port ,databaseUrl} = config.get('db');
const {
  auth,
  name,
  host,
  username,
  password,
  dbport
} = _config.default.get('db');

const databaseUrl = auth ? `mongodb://${username}:${password}@${host}:${dbport}/${name}` : `mongodb://${host}:${dbport}/${name}`; //"mongodb://TruckingToolApplication:DBdhsdru4842@54.201.160.69:58173/TruckingToolApplication"
//
// Mongose setup with server

console.log("databaseUrl", databaseUrl);

_mongoose.default.connect(databaseUrl, {
  'useCreateIndex': true,
  'useNewUrlParser': true,
  'useUnifiedTopology': true,
  'useFindAndModify': false
});

const connection = () => {
  _mongoose.default.connection.on('connected', function () {
    console.log('Mongoose connected! ');
  });
};

exports.connection = connection;