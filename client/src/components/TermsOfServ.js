import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { TosWeight } from "./content/TosWeight";
import './css/Tos.css'; // Include this to import the CSS styles

export function Tos({ open, onAccept, onClose }) {
    const [isAgreed, setIsAgreed] = useState(false);
    const [agreeSize, setAgreeSize] = useState('14px');
    const [agreeMoving, setAgreeMoving] = useState(false);
    const [agreeScale, setAgreeScale] = useState(1);
    const [bounceCount, setBounceCount] = useState(0);
    const [spin, setSpin] = useState(false);

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
        if (agreeSizer < 80) {
            agreeSizer += 6;
            setAgreeSize(`${agreeSizer}px`);
            setAgreeScale(agreeSizer / 12);
            if (agreeSizer > 80) {
                setAgreeMoving(true);
            }
        }
    };
    
    useEffect(() => {
        if (agreeMoving && bounceCount < 5) {
            const interval = setInterval(() => {
                setBounceCount(bounceCount + 1);
            }, 2000);

            return () => clearInterval(interval);
        } else if (bounceCount === 5) {
            setSpin(true);
        }
    }, [agreeMoving, bounceCount]);

    
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
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                    <div style={{position: 'relative', width: '100%', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p className={spin ? 'spin' : agreeMoving ? 'move' : ''} style={{fontSize: agreeSize, position: 'absolute'}}>
                            I agree,
                        </p>
                    </div>
                    <div style={{alignSelf: 'flex-end', marginTop: '20px'}}>
                        <input type="checkbox" id="agree" name="agree" checked={isAgreed} onChange={handleAgreeChange} style={{transform: `scale(${agreeScale})`}} /> 
                        <br/><br/>
                        <button type="submit" style={{marginTop: '10px'}}>Submit</button>
                    </div>
                </form>
            </div>
        </Modal>
    );

}

export default Tos;

