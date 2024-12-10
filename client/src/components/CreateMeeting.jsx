import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ButtonGroup, Col, Form, Row, ToggleButton, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Select from "react-select";
import { useUser } from "../context/UserContext";
import axios from "axios";
import dayjs from "dayjs";

const CreateMeeting = (props) => {
  const { userProfile } = useUser();
  const [availibleTimes, setAvailableTimes] = useState([]);
  const [err, setErr] = useState(null);

  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    location: "",
    description: "",
    participants: [], // Full participant objects (with value and label)
    start: dayjs().month(10).date(18),
    duration: 30, // Default duration (in minutes)
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userProfile) {
      fetchUsers();
    }
  }, [userProfile]);

  useEffect(() => {
    if (meetingDetails.participants.length > 0 && meetingDetails.duration) {
      fetchAvailableTimes();
    }
  }, [meetingDetails.participants, meetingDetails.duration]);

  const fetchAvailableTimes = async () => {
    console.log("Fetching Available Times...");
    try {
      // Extract user IDs
      const userIDs = [
        ...meetingDetails.participants.map((participant) => participant.value),
        userProfile.userID,
      ];
  
      // Send a POST request with the required body data
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/availability`,
        {
          userIds: userIDs, // Sending user IDs in the body
          duration: meetingDetails.duration, // Sending duration in the body
        }
      );
      console.log(response.data); // Handle the response
      setAvailableTimes(response.data); // Assuming the response contains available time slots
    } catch (error) {
      console.error("Error fetching user availability:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/`
      );
      const usersOptions = usersData.data
        .filter((user) => user.userID !== userProfile.userID)
        .map((user) => ({
          value: user.userID,
          label: user.fullName,
        }));
      setUsers(usersOptions);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleParticipantsChange = (selectedOptions) => {
    setMeetingDetails((prevState) => ({
      ...prevState,
      participants: selectedOptions, // Keep full objects here
    }));
  };

  const handleStartDayChange = (newDate) => {
    setMeetingDetails((prevState) => ({
      ...prevState,
      start: newDate,
    }));
  };

  const handleStartTimeChange = (e) => {
    const values = e.target.value.split(":")
    const newStartTime = meetingDetails.start.hour(values[0]).minute(values[1]).second(values[2]);
    setMeetingDetails((prevState) => ({
      ...prevState,
      start: newStartTime,
    }));
  };

  const handleDurationChange = (e) => {
    setMeetingDetails((prevState) => ({
      ...prevState,
      duration: parseInt(e.target.value, 10),
    }));

    console.log(meetingDetails.duration)
  };

  const postMeeting = async (e) => {
    e.preventDefault();
  
    // Validate if time is selected
    if (!meetingDetails.start || !availibleTimes.some(day => 
      dayjs(day.date).isSame(meetingDetails.start, "day") && 
      day.times.includes(meetingDetails.start.format("HH:mm:ss"))
    )) {
      setErr({ field: "time", message: "Please select a valid time." });
      setTimeout(() => setErr(null), 3000); // Clear the error after 3 seconds
      return;
    }
  
    try {
      // Map participants to IDs inside the postMeeting function
      const participantIDs = meetingDetails.participants.map(
        (participant) => participant.value
      );
  
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/events/`, {
        title: meetingDetails.title,
        location: meetingDetails.location,
        description: meetingDetails.description,
        participants: participantIDs, // Send IDs only
        start: meetingDetails.start ? meetingDetails.start.toISOString() : null, // Send start time or null
        duration: meetingDetails.duration,
        organizerID: userProfile.userID, // Match the controller's expected key
        requiresConfirmation: userProfile.role === "Administrator" ? 0 : 1,
      });
  
      props.onHide(); // Close the modal after submission
    } catch (err) {
      if (err.response && err.response.data) {
        setErr(err.response.data);
        setTimeout(() => setErr(null), 3000); // Hide after 3 seconds
      } else {
        console.error("Error creating meeting: ", err);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number); // Split and parse hours and minutes
    const period = hours >= 12 ? 'pm' : 'am'; // Determine AM/PM
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format (12 stays 12, 0 becomes 12)
    return `${formattedHours}:${minutes.toString().padStart(2, '0')}${period}`;
}

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
        <Form>
          <Row>
            {/* Left Column: Form Fields */}
            <Col md={availibleTimes.length > 0 ? 4 : 7}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="title">Title</Form.Label>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="title-error-tip">{err?.message}</Tooltip>}
                  show = {err?.field == "title"}
                >
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    id="title"
                    name="title"
                    value={meetingDetails.title}
                    onChange={handleInputChange}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="location">Location</Form.Label>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="location-error-tip">{err?.message}</Tooltip>}
                  show = {err?.field == "location"}
                >
                  <Form.Control
                    type="text"
                    placeholder="Location"
                    id="location"
                    name="location"
                    value={meetingDetails.location}
                    onChange={handleInputChange}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="participants">Participants</Form.Label>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="participants-error-tip">{err?.message}</Tooltip>}
                  show = {err?.field === "participants"}
                >
                  <Select
                    id="participants"
                    isMulti
                    options={users}
                    value={meetingDetails.participants}
                    onChange={handleParticipantsChange}
                    placeholder="Participants"
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Description"
                  id="description"
                  name="description"
                  value={meetingDetails.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="duration">Duration</Form.Label>
                <Form.Select size="sm" onChange={handleDurationChange}>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hr</option>
                  <option value={90}>1 hr 30 min</option>
                  <option value={120}>2 hr</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Right Column: Calendar and Date/Duration Fields */}
            <Col md={5}>
              <div className="mt-4 p-0">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={meetingDetails.start}
                    onChange={handleStartDayChange}
                    // disablePast={true}
                    minDate={dayjs('2024-11-18')}
                    maxDate={dayjs('2024-12-16')}
                  />
                </LocalizationProvider>
              </div>
            </Col>

            {/* Time Selection */}
            {availibleTimes.length > 0 && (
              <Col md={3}>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="time-error-tip">{err?.message}</Tooltip>}
                  show = {err?.field === "time"}
                >
                  <Form.Label htmlFor="time">Time</Form.Label>
                </OverlayTrigger>
                <ButtonGroup className="w-100 d-flex flex-wrap">
                  {availibleTimes
                    .find((time) =>
                      dayjs(time.date).isSame(meetingDetails.start, 'day') // Use Day.js to compare dates
                    )
                    ?.times.map((time, index) => (
                      <div key={index} className="p-1">
                        <ToggleButton
                          id={`time-${index}`}
                          type="checkbox"
                          variant="outline-primary"
                          value={time} // The time string itself as the value
                          checked={meetingDetails.start.format('HH:mm:ss') === time} // Compare the selected time
                          onChange={handleStartTimeChange} // Store selected time
                        >
                          {formatTime(time)} {/* Display the time */}
                        </ToggleButton>
                      </div>
                    ))}
                </ButtonGroup>
              </Col>
            )}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button onClick={props.onHide} variant="danger">
          Cancel
        </Button>
        <Button onClick={postMeeting} variant="primary">
          Create Meeting
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateMeeting;
