require('dotenv').config();
const axios = require('axios');

const openaiApiKey = process.env.OPENAI_API_KEY;

const moderateText = async (content) => {
    console.log('Checking content moderation...');
    console.log('Content to be moderated:', content);

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/moderations', // Update this to the correct moderation endpoint
            { input: content },
            { headers: { 'Authorization': `Bearer ${openaiApiKey}` } }
        );

        console.log('API Response Data:', response.data);

        // Extract the moderation result from the returned data
        const flagged = response.data.results[0].flagged;
        const categories = response.data.results[0].categories;

        if (flagged) {
            console.log('Content flagged for:', Object.keys(categories).filter(cat => categories[cat]));
            return '0'; // Shouldn't be posted
        } else {
            return '1'; // Good to go
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return '0';  // Default to '0' on any error as a safe measure
    }
};

module.exports = moderateText;
