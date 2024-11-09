import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Select from 'react-select';

const CreateMeeting = (props) => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const session = useSession();

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Meeting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="subject">Subject</Form.Label>
                <Form.Control type="text" placeholder="Subject" id="subject" />
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label htmlFor="location">Location</Form.Label>
                <Form.Control type="text" placeholder="Location" id="location" />
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label htmlFor="search">Participants</Form.Label>
                <Form.Control type="search" placeholder="Participants" id="search" />
              </Form.Group>
            </Col>
          </Row>
          <Form.Label htmlFor="desc">Description</Form.Label>
          <Form.Control as="textarea" placeholder="Description" id="desc" />
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button onClick={props.onHide} variant="danger">Cancel</Button>
        <Button>Create Meeting</Button> 
      </Modal.Footer>
    </Modal>
  );
}

export default CreateMeeting;
