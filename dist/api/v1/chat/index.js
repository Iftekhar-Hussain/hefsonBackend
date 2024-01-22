"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createGroup = _interopRequireDefault(require("./createGroup"));

var _inbox = _interopRequireDefault(require("./inbox"));

var _listing = _interopRequireDefault(require("./listing"));

var _clearChat = _interopRequireDefault(require("./clearChat"));

var _userSearch = _interopRequireDefault(require("./userSearch"));

var _findThreadId = _interopRequireDefault(require("./findThreadId"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all device routers.
 * @author: Aditi Goel
 */
var _default = [_createGroup.default, _inbox.default, _listing.default, _clearChat.default, _userSearch.default, _findThreadId.default];
exports.default = _default;