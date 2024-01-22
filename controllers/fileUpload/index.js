const multer = require("multer");
import moment from "moment";
import message from "./message";
import { successAction, failAction } from "../../utilities/response";

const fs = require("fs");

/**
 * file upload function
 */


export const fileUpload = (req, res) => {
  const folder = 'public/uploads/';
  const fullUrl = req.protocol + "://" + req.get("host");

  let files = [];
  if (!req.files.image) {
    return res.status(400).json(failAction(message.required, []));
  }
  const { image } = req.files
  const { data, mimetype, name } = image
  if (mimetype !== "image/png" && mimetype !== "image/jpg" && mimetype !== "image/jpeg") {
    // throw new Error('Only .png, .jpg and .jpeg format allowed!')
    return res.status(400).json(failAction('Only .png, .jpg and .jpeg format allowed!', []));
  }
  let filePath = `${folder}${Date.now()}-${name.toLowerCase().split(' ').join('-')}`;
  fs.writeFile(filePath, data, 'binary', function (err) {
    if (err) {
      console.log(err)

      res.status(400).json(failAction(message.FAILED, []));
    }
    console.log('File saved.')
    return res.status(200).json(successAction({ filePath }, message.OK));
  })
};

export const uploadBusinessDoc = (req, res) => {
  const folder = 'public/business-docs/';
  const fullUrl = req.protocol + "://" + req.get("host");

  let files = [];
  if (!req.files.file) {
    return res.status(400).json(failAction(message.required, []));
  }
  const { file } = req.files
  const { data, mimetype, name } = file
  // if (mimetype !== "image/png" && mimetype !== "image/jpg" && mimetype !== "image/jpeg") {
  //   // throw new Error('Only .png, .jpg and .jpeg format allowed!')
  //   return res.status(400).json(failAction('Only .png, .jpg and .jpeg format allowed!', []));
  // }

  let filePath = `${folder}${Date.now()}-${name.toLowerCase().split(' ').join('-')}`;
  fs.writeFile(filePath, data, 'binary', function (err) {
    if (err) {
      console.log(err)

      res.status(400).json(failAction(message.FAILED, []));
    }
    console.log('File saved.')
    return res.status(200).json(successAction({ filePath }, message.OK));
  })
};


export const FileUploadController = {
  fileUpload(req, res, next) {
    const folder = 'public/uploads/';
    const fullUrl = req.protocol + "://" + req.get("host");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, folder);
      },
      filename: function (req, file, cb) {
        console.log(req, file)
        let nameSplitArr = file.originalname.split(".");
        let fileExtension = nameSplitArr[nameSplitArr.length - 1];
        file.name = `${moment().unix()}.${fileExtension}`;
        cb(null, file.name);
      },
    });
    const upload = multer({ storage: storage }).any('image')
    upload(req, res, function (err) {

      if (err) {
        console.log(err);
        //An error occurred when uploading
        res.status(400).json(failAction([], message.FAILED));
      } else {
        let files = [];
        _.each(req.files, function (file) {
          files.push(`${fullUrl}/uploads/${file.name}`);
        });
        console.log("files", files, req.files)
        res.status(200).json(successAction(files, message.OK));
      }
    });
  },
  removeFile(req, res) {
    let params = req.body;
    const fullUrl = req.protocol + "://" + req.get("host");
    try {
      if (!params || !params.removeFilePath) {
        return res.badRequest(err, message.BAD_REQUEST);
      }
      if (params.removeFilePath.indexOf("http") > -1) {
        params.removeFilePath = params.removeFilePath.replace(fullUrl, "");
      }
      fs.unlinkSync(`${rootPath}/${params.removeFilePath}`);
      res.status(200).json(successAction(files, message.REMOVED_SUCCESS));
    } catch (error) {
      res.status(400).json(failAction(files, message.FAILED));
    }
  },
};
