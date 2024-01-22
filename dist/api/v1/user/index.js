"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _login = _interopRequireDefault(require("./login"));

var _logout = _interopRequireDefault(require("./logout"));

var _forgotPassword = _interopRequireDefault(require("./forgot-password"));

var _getProfile = _interopRequireDefault(require("./get-profile"));

var _changePassword = _interopRequireDefault(require("./change-password"));

var _registerUser = _interopRequireDefault(require("./register-user"));

var _updateUser = _interopRequireDefault(require("./update-user"));

var _emailVerification = _interopRequireDefault(require("./email-verification"));

var _resendEmailToken = _interopRequireDefault(require("./resend-email-token"));

var _resetPassword = _interopRequireDefault(require("./reset-password"));

var _updateProfile = _interopRequireDefault(require("./update-profile"));

var _getTerms = _interopRequireDefault(require("./get-terms"));

var _updateNotificationSetting = _interopRequireDefault(require("./updateNotificationSetting"));

var _list = _interopRequireDefault(require("./list"));

var _detail = _interopRequireDefault(require("./detail"));

var _addUser = _interopRequireDefault(require("./addUser"));

var _dashboard = _interopRequireDefault(require("./dashboard"));

var _search = _interopRequireDefault(require("./search"));

var _validateToken = _interopRequireDefault(require("./validateToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all user routers.
 * @author: Aditi Goel
 */
//import socialLogin from "./social-login"
//import verifyPhone from "./phone-verification"
//import resendPhoneToken from "./resend-phone-token"
var _default = [_updateUser.default, _login.default, _logout.default, _registerUser.default, _forgotPassword.default, _getProfile.default, _changePassword.default, //socialLogin,
_emailVerification.default, // verifyPhone,
_resendEmailToken.default, // resendPhoneToken,
_resetPassword.default, _updateProfile.default, _getTerms.default, _updateNotificationSetting.default, _list.default, _detail.default, _addUser.default, _dashboard.default, _search.default, _validateToken.default];
exports.default = _default;