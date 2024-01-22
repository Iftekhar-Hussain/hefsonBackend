/*
 * @file: file.js
 * @description: It Contain function layer for file service.
 * @author: Ankit Kumar Gautam
 */

import Message from "../utilities/messages";

import { uploadFile } from "../utilities/universal";

/********** Upload User Image ************/
export const uploadImage = async (payload) => {
  if (payload.files) {
    const fileDataImg = payload.files.uploadImage;
    const fileName = `${Date.now()}-${payload.files.uploadImage.name}`;
    /*********  Upload Image File *********/
    let src = `public/uploads/${fileName}`;

    await fileDataImg.mv(src);

    let fileData = await uploadFile(
      payload.files.uploadImage.data,
      src,
      payload.folderName + "/" + fileName
    );

    /******************/
    let updatedUserData = {};
    if (fileData) {
      const imgObject = {
        filename: fileName,
        src: fileData,
        thumbnail: fileData,
      };
      payload.uploadImage = imgObject;
    } else throw new Error(Message.imageUploadError);
    // return updatedUserData;
    return fileData;
  }
};

/*********************************************/
