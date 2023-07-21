// AWS SDK and FS (File System) for Node.js
const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS
AWS.config.update({
  region: 'your-region',
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
});

// Create a new instance of Rekognition
const rekognition = new AWS.Rekognition();

// Read the image file into a Buffer
const image = fs.readFileSync('path-to-your-image.jpg');

const params = {
  Image: {
    Bytes: image,
  },
};

// Call Rekognition
rekognition.recognizeCelebrities(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    const celebrities = data.CelebrityFaces;

    // Search for Jackie Chan in the list of recognized celebrities
    const jackieChan = celebrities.find(celebrity => celebrity.Name === 'Jackie Chan');

    if (jackieChan) {
      console.log('Jackie Chan was recognized in the image.');
      console.log(jackieChan);
    } else {
      console.log('Jackie Chan was not recognized in the image.');
    }
  }
});
