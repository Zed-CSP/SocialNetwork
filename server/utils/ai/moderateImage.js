const { rekognition } = require('../../config/s3');

const moderateImage = async (s3Url) => {
    try {
      const urlParts = s3Url.split('/');
      const bucket = urlParts[2].split('.')[0];
      const key = urlParts.slice(3).join('/');
      

        const params = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: key
                }
            }
        };

        const response = await rekognition.detectModerationLabels(params).promise();

        const unsafeContents = response.ModerationLabels.filter(label => label.Confidence > 90);  // Adjust the confidence level as needed

        if (unsafeContents.length > 0) {
            console.log('Unsafe content detected:', unsafeContents);
            return false; // Image contains unsafe content
        } else {
            console.log('Image is safe.');
            return true; // Image is safe
        }
    } catch (error) {
        console.error(`Error moderating image: ${error}`);
        throw error;
    }
};

module.exports = moderateImage;
