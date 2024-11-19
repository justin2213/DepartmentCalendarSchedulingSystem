import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { useSession } from '@supabase/auth-helpers-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const CreateMeeting = (props) => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const session = useSession();

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      className="custom-modal"
      
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Meeting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Left Column: Form Fields */}
          <Col md={7}> {/* Allocated 7 parts out of 12 to the form fields */}
            <Form>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="subject">Subject</Form.Label>
                <Form.Control type="text" placeholder="Subject" id="subject" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="location">Location</Form.Label>
                <Form.Control type="text" placeholder="Location" id="location" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="search">Participants</Form.Label>
                <Form.Control type="search" placeholder="Participants" id="search" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="desc">Description</Form.Label>
                <Form.Control as="textarea" placeholder="Description" id="desc" />
              </Form.Group>
            </Form>
          </Col>

          {/* Right Column: Calendar and Date/Duration Fields */}
          <Col md={5}> {/* Allocated 5 parts out of 12 to the calendar */}
            <div className="mt-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
              </LocalizationProvider>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button onClick={props.onHide} variant="danger">
          Cancel
        </Button>
        <Button>Create Meeting</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateMeeting;
