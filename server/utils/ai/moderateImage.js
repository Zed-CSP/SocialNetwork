// Import the AWS SDK
const AWS = require("aws-sdk");

// Configure the AWS SDK with your region
AWS.config.update({ region: "us-east-1" }); // Replace with your region

// Create a new instance of the Rekognition service
const rekognition = new AWS.Rekognition();

/**
 * Check if Jackie Chan is in an image using Amazon Rekognition.
 * 
 * @param {Buffer} imageBytes - A buffer containing the image bytes.
 * @returns {Promise<boolean>} - A promise that resolves to true if Jackie Chan is detected in the image, or false if not.
 */


const checkForJackieChan = async (imageBytes) => {
  const params = {
    Image: {
      Bytes: imageBytes,
    },
  };

  try {
    const response = await rekognition.recognizeCelebrities(params).promise();

    // Check if Jackie Chan is in the returned celebrities
    const jackieChan = response.CelebrityFaces.find(face => face.Name === "Jackie Chan");

    if (jackieChan) {
      // If Jackie Chan was returned, he was detected in the image.
      console.log(`Jackie Chan detected in image with confidence ${jackieChan.Face.Confidence}`);
      return true;
    } else {
      // If Jackie Chan was not returned, he was not detected in the image.
      return false;
    }
  } catch (error) {
    console.error(`An error occurred while checking image for Jackie Chan:`, error);
    throw error;
  }
};

module.exports = checkForJackieChan;
