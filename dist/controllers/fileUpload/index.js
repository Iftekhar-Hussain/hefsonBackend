"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUploadController = exports.uploadBusinessDoc = exports.fileUpload = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _message = _interopRequireDefault(require("./message"));

var _response = require("../../utilities/response");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const multer = require("multer");

const fs = require("fs");
/**
 * file upload function
 */


const fileUpload = (req, res) => {
  const folder = 'public/uploads/';
  const fullUrl = req.protocol + "://" + req.get("host");
  let files = [];

  if (!req.files.image) {
    return res.status(400).json((0, _response.failAction)(_message.default.required, []));
  }

  const {
    image
  } = req.files;
  const {
    data,
    mimetype,
    name
  } = image;

  if (mimetype !== "image/png" && mimetype !== "image/jpg" && mimetype !== "image/jpeg") {
    // throw new Error('Only .png, .jpg and .jpeg format allowed!')
    return res.status(400).json((0, _response.failAction)('Only .png, .jpg and .jpeg format allowed!', []));
  }

  let filePath = `${folder}${Date.now()}-${name.toLowerCase().split(' ').join('-')}`;
  fs.writeFile(filePath, data, 'binary', function (err) {
    if (err) {
      console.log(err);
      res.status(400).json((0, _response.failAction)(_message.default.FAILED, []));
    }

    console.log('File saved.');
    return res.status(200).json((0, _response.successAction)({
      filePath
    }, _message.default.OK));
  });
};

exports.fileUpload = fileUpload;

const uploadBusinessDoc = (req, res) => {
  const folder = 'public/business-docs/';
  const fullUrl = req.protocol + "://" + req.get("host");
  let files = [];

  if (!req.files.file) {
    return res.status(400).json((0, _response.failAction)(_message.default.required, []));
  }

  const {
    file
  } = req.files;
  const {
    data,
    mimetype,
    name
  } = file; // if (mimetype !== "image/png" && mimetype !== "image/jpg" && mimetype !== "image/jpeg") {
  //   // throw new Error('Only .png, .jpg and .jpeg format allowed!')
  //   return res.status(400).json(failAction('Only .png, .jpg and .jpeg format allowed!', []));
  // }

  let filePath = `${folder}${Date.now()}-${name.toLowerCase().split(' ').join('-')}`;
  fs.writeFile(filePath, data, 'binary', function (err) {
    if (err) {
      console.log(err);
      res.status(400).json((0, _response.failAction)(_message.default.FAILED, []));
    }

    console.log('File saved.');
    return res.status(200).json((0, _response.successAction)({
      filePath
    }, _message.default.OK));
  });
};

exports.uploadBusinessDoc = uploadBusinessDoc;
const FileUploadController = {
  fileUpload(req, res, next) {
    const folder = 'public/uploads/';
    const fullUrl = req.protocol + "://" + req.get("host");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, folder);
      },
      filename: function (req, file, cb) {
        console.log(req, file);
        let nameSplitArr = file.originalname.split(".");
        let fileExtension = nameSplitArr[nameSplitArr.length - 1];
        file.name = `${(0, _moment.default)().unix()}.${fileExtension}`;
        cb(null, file.name);
      }
    });
    const upload = multer({
      storage: storage
    }).any('image');
    upload(req, res, function (err) {
      if (err) {
        console.log(err); //An error occurred when uploading

        res.status(400).json((0, _response.failAction)([], _message.default.FAILED));
      } else {
        let files = [];

        _.each(req.files, function (file) {
          files.push(`${fullUrl}/uploads/${file.name}`);
        });

        console.log("files", files, req.files);
        res.status(200).json((0, _response.successAction)(files, _message.default.OK));
      }
    });
  },

  removeFile(req, res) {
    let params = req.body;
    const fullUrl = req.protocol + "://" + req.get("host");

    try {
      if (!params || !params.removeFilePath) {
        return res.badRequest(err, _message.default.BAD_REQUEST);
      }

      if (params.removeFilePath.indexOf("http") > -1) {
        params.removeFilePath = params.removeFilePath.replace(fullUrl, "");
      }

      fs.unlinkSync(`${rootPath}/${params.removeFilePath}`);
      res.status(200).json((0, _response.successAction)(files, _message.default.REMOVED_SUCCESS));
    } catch (error) {
      res.status(400).json((0, _response.failAction)(files, _message.default.FAILED));
    }
  }

};
exports.FileUploadController = FileUploadController;