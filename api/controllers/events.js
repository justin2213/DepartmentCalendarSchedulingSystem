import { db } from "../db.js"
import dayjs from 'dayjs';

export const getEvents = (req, res) => {

  // SQL query to fetch events with meeting details and attendee info for the user
  const query = `
  SELECT
    e.eventID,
    e.organizerID,
    e.eventTitle,
    e.eventLocation,
    e.eventStart,
    e.eventEnd,
    e.eventType,
    m.meetingDesc AS \`desc\`, 
    m.meetingStatus AS status,
    m.requiresConfirmation,
    u.userID,
    u.email,
    u.fullName,
    u.department,
    u.role,
    u.office,
    ea.isConfirmed
  FROM Events e
  LEFT JOIN Meetings m ON e.eventID = m.eventID
  INNER JOIN EventAttendees ea ON e.eventID = ea.eventID
  INNER JOIN Users u ON ea.attendeeID = u.userID
  WHERE ea.attendeeID = ?
`;


  db.query(query, [req.params.id], (err, rows) => {
    if (err) return res.json(err);

    // Process rows to create structured events array
    const events = rows.reduce((acc, row) => {
      // Check if the event already exists in the array
      let event = acc.find(evt => evt.eventID === row.eventID);

      // If event is not in the accumulator, add a new one
      if (!event) {
        event = {
          eventID: row.eventID,
          organizerID: row.organizerID,
          eventTitle: row.eventTitle,
          eventLocation: row.eventLocation,
          eventStart: row.eventStart,
          eventEnd: row.eventEnd,
          eventType: row.eventType,
          meetingDetails: row.eventType === 'meeting' ? {
            desc: row.desc,
            status: row.status,
            requiresConfirmation: row.requiresConfirmation
          } : null,
          attendees: []
        };
        acc.push(event);
      }

      // Add the attendee details to the event's attendees array
      event.attendees.push({
        userID: row.userID,
        email: row.email,
        fullName: row.fullName,
        department: row.department,
        role: row.role,
        office: row.office,
        isConfirmed: row.isConfirmed
      });

      return acc;
    }, []);
  
    // Send the structured events array as the response
    return res.status(200).json(events);
  });
};

export const postMeeting = (req, res) => {

  const {
    organizerID,
    title,
    location,
    start,
    duration,
    description,
    requiresConfirmation,
    participants,
  } = req.body;

  // Validation rules
  const validations = [
    { field: "title", value: title, message: "Meeting must have a title!" },
    { field: "location", value: location, message: "Meeting must have a location!" },
    { field: "participants", value: participants, message: "Meeting must have at least one participant!" },
  ];

  // Check each validation
  for (const { field, value, message } of validations) {
    if (!value || (Array.isArray(value) && value.length === 0) || value.length === 0) {
      return res.status(400).json({ field, message });
    }
  }

  // Reformat the datetime values for MySQL compatibility
  const formattedStart = dayjs(start).format("YYYY-MM-DD HH:mm:ss");
  const eventEnd = dayjs(start).add(duration, "minute").format("YYYY-MM-DD HH:mm:ss");

  const eventQuery = `
    INSERT INTO Events (organizerID, eventTitle, eventLocation, eventStart, eventEnd, eventType)
    VALUES (?, ?, ?, ?, ?, 'meeting')
  `;

  db.query(
    eventQuery,
    [organizerID, title, location, formattedStart, eventEnd],
    (err, eventResult) => {
      if (err) {
        console.error("Error inserting into Events table:", err);
        return res.status(500).json({ error: "Failed to create event." });
      }

      const eventID = eventResult.insertId; // Get the ID of the newly created event

      const meetingQuery = `
        INSERT INTO Meetings (eventID, meetingDesc, meetingStatus, requiresConfirmation)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        meetingQuery,
        [
          eventID,
          description,
          requiresConfirmation === 0 ? "confirmed" : "pending", // Determine meetingStatus
          requiresConfirmation,
        ],
        (err) => {
          if (err) {
            console.error("Error inserting into Meetings table:", err);
            return res.status(500).json({ error: "Failed to create meeting details." });
          }

          const attendeesQuery = `
            INSERT INTO EventAttendees (eventID, attendeeID, isConfirmed)
            VALUES ?
          `;

          // Add organizerID with isConfirmed as 1, and map other participants
          const attendeesValues = [
            [eventID, organizerID, 1], // Organizer is always confirmed
            ...participants.map((participantID) => [
              eventID,
              participantID,
              requiresConfirmation === 0 ? 1 : 0,
            ]),
          ];

          db.query(
            attendeesQuery,
            [attendeesValues],
            (err) => {
              if (err) {
                console.error("Error inserting into EventAttendees table:", err);
                return res.status(500).json({ error: "Failed to add participants." });
              }

              return res.status(201).json({ message: "Meeting created successfully!" });
            }
          );
        }
      );
    }
  );
};