require('dotenv').config();
const axios = require('axios');


const openaiApiKey = process.env.OPENAI_API_KEY;


const moderateText = async (content) => {
    console.log('hit me baby one more time');
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: `You are a helpful assistant that suggests edits to make sure user posts are respectful and appropriate.\nUser: ${content}\nAssistant:`,
                max_tokens: 60,
                temperature: 0.5,
            },
            { headers: { 'Authorization': `Bearer ${openaiApiKey}` } }
        );

        // Extract the assistant's message from the returned text, if it exists
        const assistantMessage = response.data.choices[0].text.trim();
        return assistantMessage || null;

    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
};

module.exports = moderateText;