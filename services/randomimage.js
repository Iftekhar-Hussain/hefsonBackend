/*
 * @file: randomimage.js
 * @description: It Contain function layer for randomimage service.
 * @author: Ankit Kumar Gautam
 */

import Message from "../utilities/messages";
import RANDOMIMAGEMODEL from "../collections/randomimage";
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
export const uploadImage = async (payload) => {
  let saveData = await RANDOMIMAGEMODEL.saveRandomimage(payload);

  return saveData;
};

/*********************************************/

/**
 *
 * @param {*} payload
 * @description - list of shipment
 */
export const listRandomimage = async (payload) => {
  let query = {
    isDeleted: { $eq: false },
  };
  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;
  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = {
      ...query,
      $or: [{ category: { $regex: regex } }, { randomTime: { $regex: regex } }],
    };
    var data = await RANDOMIMAGEMODEL.listRandomimage(
      payload,
      query,
      sortBy,
      sortValue
    );
  } else {
    var data = await RANDOMIMAGEMODEL.listRandomimage(
      payload,
      query,
      sortBy,
      sortValue
    );
  }
  const totalRecords = await data.totalRecords;
  return {
    list: await data.list,
    total: totalRecords.length,
    limit: payload["limit"] ? payload["limit"] : 10,
  };
};

/**
 *
 * @param {*} payload
 * @description - update details of shipment
 */
export const updateImage = async (payload) => {
  return await RANDOMIMAGEMODEL.updateRandomimage(payload);
};

/**
 *
 * @param {*} payload
 * @description - update details of shipment
 */
export const deleteRandomImage = async (payload) => {
  return await RANDOMIMAGEMODEL.deleteRandomimage(payload);
};
