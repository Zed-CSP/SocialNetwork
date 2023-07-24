import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { TosWeight } from "./content/TosWeight";
import './css/Tos.css'; // Include this to import the CSS styles

export function Tos({ open, onAccept, onClose }) {
    const [isAgreed, setIsAgreed] = useState(false);
    const [agreeSize, setAgreeSize] = useState('14px');
    const [agreeMoving, setAgreeMoving] = useState(false);
    const [agreeScale, setAgreeScale] = useState(1);

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
        let agreeSizer = parseInt(agreeSize.slice(0, -2));
        if (agreeSizer < 90) {
            agreeSizer += 6;
            setAgreeSize(`${agreeSizer}px`);
            setAgreeScale(agreeSizer / 14);
        }
    };
    
    useEffect(() => {
        const agreeSizer = parseInt(agreeSize.slice(0, -2));
        if (agreeSizer >= 80) {
            setAgreeMoving(true);
        } else {
            setAgreeMoving(false);
        }
    }, [agreeSize]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                height: '90vh',
                backgroundColor: 'white',
                padding: '20px',
                overflowY: 'auto',
            }}>
                {TosWeight()}
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '75vw'}}>
                    <div style={{position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p className={agreeMoving ? 'spinAndMove' : ''} style={{fontSize: agreeSize, position: 'absolute'}}>
                            I agree,
                        </p>
                    </div>
                    <div style={{alignSelf: 'flex-end', marginTop: '20px'}}>
                        <input type="checkbox" id="agree" name="agree" checked={isAgreed} onChange={handleAgreeChange} style={{transform: `scale(${agreeScale})`}} /> 
                        <br/><br/>
                        <button 
                            type="submit" 
                            style={{
                                marginTop: '10px', 
                                border: 'none', 
                                borderRadius: '5px',
                                padding: '10px 20px',
                                color: '#fff', 
                                fontSize: '16px',
                                background: 'linear-gradient(45deg, #4b6cb7 0%, #182848 100%)', 
                                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)', 
                                textTransform: 'uppercase', 
                                cursor: 'pointer', 
                                outline: 'none'
                            }}
                            onMouseDown={(e) => {
                                e.target.style.transform = 'scale(0.95)';
                                e.target.style.boxShadow = '0 2px 3px 1px rgba(0, 0, 0, .3)';
                            }}
                            onMouseUp={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 3px 5px 2px rgba(0, 0, 0, .3)';
                            }}
                        >
                            Submit
                        </button>

                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default Tos;
