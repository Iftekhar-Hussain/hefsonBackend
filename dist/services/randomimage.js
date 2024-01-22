"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRandomImage = exports.updateImage = exports.listRandomimage = exports.uploadImage = void 0;

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _randomimage = _interopRequireDefault(require("../collections/randomimage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: randomimage.js
 * @description: It Contain function layer for randomimage service.
 * @author: Ankit Kumar Gautam
 */
// import { uploadFile } from "../utilities/universal";

/********** Upload random Image ************/
// export const uploadImage = async (payload) => {
//   if (payload.files) {
//     const fileDataImg = payload.files.uploadImage;
//     const fileName = `${Date.now()}-${payload.files.uploadImage.name}`;
//     /*********  Upload Image File *********/
//     let src = `public/uploads/${fileName}`;
//     await fileDataImg.mv(src);
//     let fileData = await uploadFile(
//       payload.files.uploadImage.data,
//       src,
//       fileName
//     );
//     /******************/
//     let updatedUserData = {};
//     if (fileData) {
//       payload.imageLink = fileData;
//       /******  save link in db   ************/
//       updatedUserData = await RANDOMIMAGEMODEL.saveRandomimage(payload);
//     } else throw new Error(Message.imageUploadError);
//     return updatedUserData;
//   }
// };

/**
 *
 * @param {*} payload
 * @description - save shipment to db
 */

/********** Save random image **********/
const uploadImage = async payload => {
  let saveData = await _randomimage.default.saveRandomimage(payload);
  return saveData;
};
/*********************************************/

/**
 *
 * @param {*} payload
 * @description - list of shipment
 */


exports.uploadImage = uploadImage;

const listRandomimage = async payload => {
  let query = {
    isDeleted: {
      $eq: false
    }
  };
  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;

  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = { ...query,
      $or: [{
        category: {
          $regex: regex
        }
      }, {
        randomTime: {
          $regex: regex
        }
      }]
    };
    var data = await _randomimage.default.listRandomimage(payload, query, sortBy, sortValue);
  } else {
    var data = await _randomimage.default.listRandomimage(payload, query, sortBy, sortValue);
  }

  const totalRecords = await data.totalRecords;
  return {
    list: await data.list,
    total: totalRecords.length,
    limit: payload["limit"] ? payload["limit"] : 10
  };
};
/**
 *
 * @param {*} payload
 * @description - update details of shipment
 */


exports.listRandomimage = listRandomimage;

const updateImage = async payload => {
  return await _randomimage.default.updateRandomimage(payload);
};
/**
 *
 * @param {*} payload
 * @description - update details of shipment
 */


exports.updateImage = updateImage;

const deleteRandomImage = async payload => {
  return await _randomimage.default.deleteRandomimage(payload);
};

exports.deleteRandomImage = deleteRandomImage;