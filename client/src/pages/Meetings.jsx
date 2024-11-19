import React, { useState } from 'react'; // React library and useState hook for state management
import { Container, Row, Col, Card, Nav, ListGroup, Button, Accordion } from 'react-bootstrap'; // Bootstrap components for layout and styling
import Meeting from '../components/Meeting.jsx'; // Meeting component to display individual meetings
import { useEvents } from '../context/EventContext.jsx'; // Hook to access meetings context

const Meetings = () => {
  const MeetingStatus = {
    UPCOMING: 'upcoming', // Status for upcoming meetings
    PENDING: 'pending',   // Status for pending meetings
    PAST: 'past',         // Status for past meetings
  };
  
  const { events } = useEvents(); // Retrieve meetings data from context
  const [status, setStatus] = useState(MeetingStatus.UPCOMING); // State to manage currently selected meeting status

  // Use a variable to hold the filtered meetings
  let meetingsToDisplay;

  // Use switch to determine which meetings to display
  switch (status) {
    case MeetingStatus.PENDING:
      meetingsToDisplay = events
        .filter(event => event.eventType === 'meeting')
        .filter(meeting => meeting.meetingDetails.status === 'pending')
        .map(meeting => (
          <Meeting key={meeting.eventID} meeting={meeting} />
        ));
      break;

    case MeetingStatus.PAST:
      meetingsToDisplay = events
        .filter(event => event.eventType === 'meeting')
        .filter(meeting => new Date(meeting.eventStart) <= new Date()) // Filter past meetings based on the date
        .map(meeting => (
          <Meeting key={meeting.eventID} meeting={meeting} />
        ));
      break;

    default:
      meetingsToDisplay = events
        .filter(event => event.eventType === 'meeting')
        .filter(meeting => new Date(meeting.eventStart) > new Date()) // Filter upcoming meetings based on the date
        .map(meeting => (
          <Meeting key={meeting.eventID} meeting={meeting} />
        ));
      break;
  }

  return (
    <Container fluid className="vh-100 d-flex flex-column align-items-center">

      <Row className="w-100 py-3 m-5 px-5">
        <Col>
          <h2><strong>Meetings</strong></h2> {/* Header for the meetings page */}
        </Col>
      </Row>

      <Row className="w-75 justify-content-center align-items-center my-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">Displaying {meetingsToDisplay.length} Event{meetingsToDisplay.length > 1  ? 's' : null}</p> 
            <Button>Filter</Button> 
          </div>
          <Card className="p-0">
            <Card.Header className="p-0">
              <Nav variant="underline" defaultActiveKey="#first" fill>
                <Nav.Item>
                  <Nav.Link onClick={() => setStatus(MeetingStatus.UPCOMING)}>Upcoming</Nav.Link> {/* Button to filter upcoming meetings */}
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={() => setStatus(MeetingStatus.PENDING)}>Pending</Nav.Link> {/* Button to filter pending meetings */}
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={() => setStatus(MeetingStatus.PAST)}>Past</Nav.Link> {/* Button to filter past meetings */}
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Accordion flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Date Range</Accordion.Header>
                <Accordion.Body>
                  Date range filter content goes here. {/* Placeholder for future date range filter */}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <ListGroup className="list-group-flush">
              {meetingsToDisplay.length > 0 ? (
                meetingsToDisplay // Render meetings if available
              ) : (
                <Row className="py-3 m-5 justify-content-center">
                  <Col xs={12} className="text-center">
                    <h5>No Meetings Available</h5> {/* Message displayed when no meetings are available */}
                  </Col>
                </Row>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


export default Meetings;
