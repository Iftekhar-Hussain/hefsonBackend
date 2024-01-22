/*
 * @file: index.js
 * @description: It's combine all user routers.
 * @author: Aditi Goel
 */

import login from "./login";
import logout from "./logout";
import forgotPassword from "./forgot-password";
import getProfile from "./get-profile";
import changePassword from "./change-password";
import register from "./register-user";
import updateUser from "./update-user";
//import socialLogin from "./social-login"
import verifyEmail from "./email-verification";
//import verifyPhone from "./phone-verification"
import resendEmailToken from "./resend-email-token";
//import resendPhoneToken from "./resend-phone-token"
import resetPassword from "./reset-password";
import updateProfile from "./update-profile";
import getTerms from "./get-terms";
import updateNotificationSetting from "./updateNotificationSetting";
import list from "./list";
import detail from "./detail";
import addUser from "./addUser";
import dashboard from "./dashboard";
import search from "./search";
import validateToken from "./validateToken";

export default [
  updateUser,
  login,
  logout,
  register,
  forgotPassword,
  getProfile,
  changePassword,
  //socialLogin,
  verifyEmail,
  // verifyPhone,
  resendEmailToken,
  // resendPhoneToken,
  resetPassword,
  updateProfile,
  getTerms,
  updateNotificationSetting,
  list,
  detail,
  addUser,
  dashboard,
  search,
  validateToken
];
