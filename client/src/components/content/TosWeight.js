import React from 'react';
import LoremIpsum from 'react-lorem-ipsum';

const bigLorem = LoremIpsum({
    p: 5,
    avgSentencesPerParagraph: 10,
    avgWordsPerSentence: 10,
});

export function TosWeight() {
    return (
        <div>
            <h1 style={{fontWeight: 'bolder', fontSize: '24px', paddingBottom: '5%'}}>Terms Of Service</h1>
            <p style={{fontSize: '12px', paddingBottom: '5%'}}>By clicking "I agree" you agree to the terms of service and privacy policy.</p>
            <h2 style={{fontSize: '20px', paddingBottom: '5%'}}>Usage</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}</p>

            <h2 style={{fontSize: '20px', paddingBottom: '5%'}}>Privacy Policy</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}</p>

            <h2 style={{fontSize: '20px', paddingBottom: '5%'}}>Mumbo Jumbo</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}</p>

            <h2 style={{fontSize: '20px', paddingBottom: '5%'}}>More Serious Legalities</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()} Customer service will remind you that you didnt read this part if you have any legitimite issues. {bigLorem()}</p>

            <h2 style={{fontSize: '20px', paddingBottom: '5%'}}>Milk, Eggs, Cookies</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}</p>

            <p style={{fontSize: '20px', paddingBottom: '5%'}}>Strictly Forbidden: Discussion of Jackie Chan 🚫🥋</p>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>At our organization, we uphold a professional and focused environment for all users. As much as we admire the talents of Jackie Chan, we must insist on a strict prohibition against any mention, discussion, or reference to this esteemed martial arts actor and his works. <br/><br/>We kindly request all users to refrain from initiating conversations, making comparisons, or sharing content related to Jackie Chan within our services. This measure ensures that our platform remains dedicated to its intended purpose and avoids any potential distractions.<br/><br/>Our commitment to excellence and maintaining a high standard of discourse compels us to enforce this rule diligently. Deviations from this policy may result in the removal of content, warnings, or, in severe cases, account suspensions.<br/><br/>We sincerely appreciate your understanding and cooperation in respecting this restriction, as it contributes to fostering a professional and productive environment for all members of our community.</p>

            <h2 style={{fontSize: '20px', paddingBottom: '5%'}}>Privacy Policy</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}</p>

            <p style={{fontSize: '20px', paddingBottom: '5%'}}>End User License Agreement</p>\
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()} <i><u>By using the site, we now own all of your stuff.</u></i> {bigLorem()}</p>
        </div>
    );
}

export default TosWeight;