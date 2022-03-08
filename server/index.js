const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

// Change bucket property to your Space name
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket:'vspace',
      acl:'public-read',
      key: function (request, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      }
    })
  }).array('upload', 1);

  app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
      if (error) {
        console.log(error);
      }
      console.log('File uploaded successfully.');
      response.send('Successfully uploaded ' + request.data + ' files!')
    });
  });


app.listen(8000, function () {
  console.log('Server listening on port 8000.');
});
