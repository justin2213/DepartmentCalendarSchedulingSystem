import { Row, Col, ListGroupItem, Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useUser } from '../context/UserContext';

function Meeting({meeting}) {
  const {userProfile} = useUser();

  const formatDateTitle = (isoDateString) => {
    const date = new Date(isoDateString);
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (isoDateString) => {
    const date = new Date(isoDateString);
  
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 24-hour format
    });
  };
  
  return (
    <>
    <ListGroupItem className="bg-light">{formatDateTitle(meeting.startTime)}</ListGroupItem>
    <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <Row className="w-100 align-items-center">
            {/* Adjust column size for responsiveness */}
            <Col xs={12} md={6}>
              <p>{formatTime(meeting.startTime)}</p>
            </Col>
            <Col xs={12} md={6}>
              <p>{meeting.title}</p>
            </Col>
          </Row>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <h5 className="mb-4"><strong>{meeting.title}</strong></h5>
            <Col xs={12} md={6}>
              <p><strong>Date:</strong> {formatDate(meeting.startTime)}</p>
              <p><strong>Time:</strong> {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</p>
              <p><strong>Location:</strong> {meeting.location}</p>
              <p><strong>Participants:</strong> {meeting.attendees.map(attendee => attendee.fullName).join(', ')}</p>
              <p><strong>Description:</strong> {meeting.description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
            {meeting.status === 'pending' && meeting.attendees.some((attendee) => 
                  attendee.userID === userProfile.userID && !attendee.isConfirmed
            )
            ? 
            <Button>Confirm Meeting</Button>
            : 
            <></>
            }
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </>
  );
}

export default Meeting;
