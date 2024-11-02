import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, ListGroup, Button, Accordion } from 'react-bootstrap';
import Meeting from '../components/Meeting.jsx';
import { useMeetings } from '../context/MeetingsContext.jsx';

function Meetings() {
  const MeetingStatus = {
    UPCOMING: 'upcoming',
    PENDING: 'pending',
    PAST: 'past',
  };
  
  const { confirmedUserMeetings, pendingUserMeetings } = useMeetings();
  const [status, setStatus] = useState(MeetingStatus.UPCOMING);

  // Use a variable to hold the filtered meetings
  let meetingsToDisplay;

  // Use switch to determine which meetings to display
  switch (status) {
    case MeetingStatus.PENDING:
      meetingsToDisplay = pendingUserMeetings.map(meeting => (
        <Meeting key={meeting.id} meeting={meeting} />
      ));
      break;

    case MeetingStatus.PAST:
      meetingsToDisplay = confirmedUserMeetings
        .filter(meeting => new Date(meeting.date) < new Date())
        .map(meeting => (
          <Meeting key={meeting.id} meeting={meeting} />
        ));
      break;

    default:
      meetingsToDisplay = confirmedUserMeetings.map(meeting => (
        <Meeting key={meeting.id} meeting={meeting} />
      ));
      break;
  }

  return (
    <Container fluid className="vh-100 d-flex flex-column align-items-center">
      {/* Green background row (should appear at the top) */}
      <Row className="w-100 py-3 m-5 px-5">
        <Col>
          <h2><strong>Meetings</strong></h2>
        </Col>
      </Row>

      {/* Red background row (should appear below the green row) */}
      <Row className="w-75 justify-content-center align-items-center my-3">
        <Col>
          {/* Flex container for p-tag and button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">Displaying {meetingsToDisplay.length} Event{meetingsToDisplay.length > 1  ? 's' : null}</p>
            <Button>Filter</Button>
          </div>
          <Card className="p-0">
            <Card.Header className="p-0">
              <Nav variant="underline" defaultActiveKey="#first" fill>
                <Nav.Item>
                  <Nav.Link onClick={() => setStatus(MeetingStatus.UPCOMING)}>Upcoming</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={() => setStatus(MeetingStatus.PENDING)}>Pending</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={() => setStatus(MeetingStatus.PAST)}>Past</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Date Range</Accordion.Header>
                <Accordion.Body>
                  Date range filter content goes here.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <ListGroup className="list-group-flush">
              {meetingsToDisplay.length > 0 ? (
                meetingsToDisplay
              ) : (
                <Row className="py-3 m-5 justify-content-center">
                  <Col xs={12} className="text-center">
                    <h5>No Meetings Available</h5>
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
