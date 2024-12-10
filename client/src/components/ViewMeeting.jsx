import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import Select from 'react-select';
import { useState, useEffect } from "react";

const ViewMeeting = (props) => {
  const { event } = props;

  // Dynamically create participant options based on event attendees
  const participantOptions = event?.attendees.map((attendee) => ({
    value: attendee.email,   // Assuming the attendee object has an email property
    label: attendee.fullName // Assuming the attendee object has a fullName property
  })) || [];

  // State to store selected participants
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleParticipantsChange = (selectedOptions) => {
    setSelectedParticipants(selectedOptions);
  };

  function formatEventDateTime() {
    const startDate = new Date(event.eventStart);
  const endDate = new Date(event.eventEnd);

  const dateOptions = { month: 'long', day: 'numeric' }; // e.g., December 6
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true }; // e.g., 9:00 PM

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(startDate);
  const startTime = new Intl.DateTimeFormat('en-US', timeOptions).format(startDate);
  const endTime = new Intl.DateTimeFormat('en-US', timeOptions).format(endDate);

  return `${formattedDate}, ${startTime} - ${endTime}`;
  }

  useEffect(() => {
    // If event exists, update selected participants based on the event attendees
    if (event && event.attendees) {
      const initialSelected = event.attendees.map((attendee) => ({
        value: attendee.email,
        label: attendee.fullName
      }));
      setSelectedParticipants(initialSelected);
    }
  }, [event]);

  return ( 
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {event ? formatEventDateTime() : "Title"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control type="text" placeholder={event ? event.eventTitle : "Title"} id="title"  readOnly/>
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label htmlFor="location">Location</Form.Label>
                <Form.Control type="text" placeholder={event ? event.eventLocation : "Location"} id="location" readOnly/>
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label htmlFor="participants">Participants</Form.Label>
                <Select
                  id="participants"
                  isMulti
                  options={participantOptions}
                  value={selectedParticipants}
                  isDisabled={true}
                  onChange={handleParticipantsChange}
                  placeholder="Participants"
                />
              </Form.Group>
            </Col>
          </Row>
          {event && event.eventType === 'meeting' ? (
            <>
              <Form.Label htmlFor="desc">Description</Form.Label>
              <Form.Control as="textarea" placeholder={event.meetingDetails.desc} id="desc" readOnly/>
            </>
          ) : null}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ViewMeeting;
