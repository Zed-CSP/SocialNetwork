require('dotenv').config();
const axios = require('axios');

const openaiApiKey = process.env.OPENAI_API_KEY;

const isItJackieChan = async (content) => {
    console.log('Checking for Jackie Chan...');
    console.log('Content to be checked:', content);

    let prompt = `Is the following text mentioning Jackie Chan's name or in any way about Jackie Chan, or his movies?: "${content}" -Please STRICTLY answer 1 for yes and 0 for No as the first character of your response, do not say Yes or No at the beginning of your response, or the start of your dialog. For no response only reply 0! IF your response is 1 please include a short description of why you think this is about Jackie Chan followed by something nice about Jackie Chan.`;

    try {
        //##################################################
        //#### Make Jackie Chan request to the OpenAI API #
        //################################################
        let itIsJackieChan = false;

        const gptResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            { headers: { 'Authorization': `Bearer ${openaiApiKey}` } }
        );
        // console.log('API Response:', JSON.stringify(gptResponse.data));

        const content = gptResponse.data.choices[0].message.content;
        console.log('API Response Data:', content);
        const isItJackieChan = content.startsWith("1");
        console.log('Is it Jackie Chan?:', isItJackieChan);

        if (isItJackieChan) {
            const jackieChanMessage = content.slice(2);
            console.log('Content is about Jackie Chan: ', jackieChanMessage);
            return ; // Shouldn't be posted
        } else {
            console.log('Content is not about Jackie Chan');
            return false; // Should be posted
        }

    } catch (error) {
        console.error(`Error: ${error}`);
        return false;  // Default to '0' on any error as a safe measure
    }
};


module.exports = isItJackieChan;