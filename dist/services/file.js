"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = void 0;

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _universal = require("../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: file.js
 * @description: It Contain function layer for file service.
 * @author: Ankit Kumar Gautam
 */

/********** Upload User Image ************/
const uploadImage = async payload => {
  if (payload.files) {
    const fileDataImg = payload.files.uploadImage;
    const fileName = `${Date.now()}-${payload.files.uploadImage.name}`;
    /*********  Upload Image File *********/

    let src = `public/uploads/${fileName}`;
    await fileDataImg.mv(src);
    let fileData = await (0, _universal.uploadFile)(payload.files.uploadImage.data, src, payload.folderName + "/" + fileName);
    /******************/

    let updatedUserData = {};

    if (fileData) {
      const imgObject = {
        filename: fileName,
        src: fileData,
        thumbnail: fileData
      };
      payload.uploadImage = imgObject;
    } else throw new Error(_messages.default.imageUploadError); // return updatedUserData;


    return fileData;
  }
};
/*********************************************/


exports.uploadImage = uploadImage;