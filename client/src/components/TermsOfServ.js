const React = require("react");
const { useState } = require('react');
const Modal = require("@material-ui/core").Modal;
const TosWeight = require("./content/TosWeight").TosWeight;

export function Tos({ open, onAccept, onClose }) {
    let agreeSize = '12px';
    const [isAgreed, setIsAgreed] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isAgreed) {
            localStorage.setItem('tos_agreed', true);
            if (onAccept) {
                onAccept();
            }
        } else {
            agreeSizeUp();
            console.error("You must agree to the Terms of Service to continue");
        }
    };

    const handleAgreeChange = (event) => {
        setIsAgreed(event.target.checked);
    };

    const agreeSizeUp = () => {
        agreeSize = agreeSize.slice(0, -2);
        if (parseInt(agreeSize) < 40) {
            agreeSize += 1;
        }
        agreeSize += 'px';
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="Reg">
                {TosWeight()}
                <form onSubmit={handleSubmit}>
                    <p style={{fontSize: agreeSize, paddingBottom: '5%'}}>I agree</p>
                    <input type="checkbox" id="agree" name="agree" checked={isAgreed} onChange={handleAgreeChange} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </Modal>
    );
}

export default Tos;
