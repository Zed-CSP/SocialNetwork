import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const JackieChanModal = ({show, handleClose, jackieChanMessage}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Jackie Chan Content Warning!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{jackieChanMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default JackieChanModal;