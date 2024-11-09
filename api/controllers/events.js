import { db } from "../db.js"

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
