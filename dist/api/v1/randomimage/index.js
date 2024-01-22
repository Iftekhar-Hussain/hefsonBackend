"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _upload = _interopRequireDefault(require("./upload"));

var _list = _interopRequireDefault(require("./list"));

var _update = _interopRequireDefault(require("./update"));

var _delete = _interopRequireDefault(require("./delete"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all file upload routers.
 * @author: Ankit Kumar Gautam
 */
var _default = [_upload.default, _list.default, _update.default, _delete.default];
exports.default = _default;