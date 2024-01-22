const path = require('path');
var AWS = require('aws-sdk');
const fs = require('fs');
const ffmpeg = require('ffmpeg');
const imagePath = "./public/images/users";
const logoPath = "./public/images/watermark.png";
import config from 'config';
const { AWS_REGION, BUCKET_NAME, S3_ACCESSKEY, S3_SECRETKEY } = config.get('app');

AWS.config.region = AWS_REGION;
const s3 = new AWS.S3({
  accessKeyId: S3_ACCESSKEY,
  secretAccessKey: S3_SECRETKEY
});


/**
Author: Aditi
Desc: upload image to AWS S3
*/
module.exports.uploadImageToS3 = async function (req, res, fileObject) {
  let UPLOADPATH = './images';//constant.uploadPath;

  let randomStr = Math.floor((Math.random() * 446699) + 99);;
  let date = new Date();
  let currentDate = date.valueOf();
  let name = randomStr + "-" + currentDate;

  let base64FileCode = fileObject;
  let docBuffer = await decodeBase64Image(base64FileCode);
  if (docBuffer.error == 'Invalid image') {
    return {
      message: "invalidImage"
    }
  }
  let imageType = docBuffer.type;
  let typeArr = new Array();
  typeArr = imageType.split("/");
  let fileExt = typeArr[1];

  let fullFileName = name + '.' + fileExt;

  var uploadLocation = 'public/images/users/' + fullFileName;

  return new Promise((resolve, reject) => {
    fs.writeFile('public/images/users/' + fullFileName, docBuffer.data,
      async function (docerr, doc) {
        let watermarkImage = await watermark(uploadLocation, fullFileName, 'image');
        let splitName = watermarkImage.split("/");
        let imageLength = splitName.length;
        let finalName = splitName[imageLength - 1]
        let readLocalFileStream = fs.createReadStream(watermarkImage);
        let s3DestinationFilePath = path.join(UPLOADPATH, finalName);

        s3.upload({
          Bucket: BUCKET_NAME,
          Key: s3DestinationFilePath,
          Body: readLocalFileStream,
          ACL: 'public-read'
        },
          function (err, result) {
            if (err) {
              reject(err.message)
            } else {
              fs.unlinkSync(watermarkImage);
              var data = {
                location: result.Location
              }
              resolve(data);
            }
          });
      });
  }).then(function (res) {
    return (res);
  })
};

/* Author : Aditi , Desc: function to decode base64 image*/
const decodeBase64Image = async function (dataString) {
  let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches) {

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
  } else {
    response.error = 'Invalid image';
  }

  return response;
};

/* Apply watermark to image*/
export const watermark = async (_path_, fileName) => {
  try {
    let existingPath = imagePath + "/" + fileName;
    var video = await new ffmpeg(existingPath);
    var watermarkPath = logoPath,
      settings = {
        position: "NW"      // Position: NE NC NW SE SC SW C CE CW
        , margin_nord: null      // Margin nord
        , margin_sud: null      // Margin sud
        , margin_east: null      // Margin east
        , margin_west: null      // Margin west
      };

    //add watermark Function
    let a = await video.fnAddWatermark(watermarkPath, settings)
    fs.unlinkSync(existingPath)
    return a;
  } catch (err) {
    console.log('err', err)
  }

};







