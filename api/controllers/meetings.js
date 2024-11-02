import { db } from "../db.js"

export const getConfirmedMeetings = async (req, res) => {
  const q = `
    SELECT 
      m.meetingID, 
      m.organizerID, 
      m.title, 
      m.description, 
      m.location, 
      m.startTime, 
      m.endTime, 
      m.status,
      u.userID AS attendeeUserID, 
      u.fullName AS attendeeName, 
      u.email AS attendeeEmail, 
      u.department AS attendeeDepartment, 
      u.role AS attendeeRole, 
      u.office AS attendeeOffice 
    FROM 
      Meetings m 
    JOIN 
      MeetingAttendees ma ON m.meetingID = ma.meetingID 
    JOIN 
      Users u ON ma.attendeeID = u.userID 
    WHERE 
      m.status = 'confirmed' 
      AND EXISTS (
        SELECT 1 
        FROM MeetingAttendees ma_sub 
        WHERE ma_sub.meetingID = m.meetingID 
          AND ma_sub.attendeeID = ?
      ) 
    ORDER BY 
      m.startTime`;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Organize meetings by meetingID
    const meetings = data.reduce((acc, row) => {
      const {
        meetingID,
        organizerID,
        title,
        description,
        location,
        startTime,
        endTime,
        status,  
        attendeeUserID,
        attendeeName,
        attendeeEmail,
        attendeeDepartment,
        attendeeRole,
        attendeeOffice
      } = row;

      // Check if this meetingID is already added to the accumulator
      if (!acc[meetingID]) {
        // If not, create the meeting structure
        acc[meetingID] = {
          meetingID,
          organizerID,
          title,
          description,
          location,
          startTime,
          endTime,
          status,  
          attendees: []
        };
      }

      // Add attendee information to the meeting's attendees array
      acc[meetingID].attendees.push({
        userID: attendeeUserID,
        fullName: attendeeName,
        email: attendeeEmail,
        department: attendeeDepartment,
        role: attendeeRole,
        office: attendeeOffice
      });

      return acc;
    }, {});

    // Convert the accumulator object to an array of meetings
    const formattedMeetings = Object.values(meetings);
    return res.status(200).json(formattedMeetings);
  });
};


export const getPendingMeetings = async (req, res) => {
  const q = `
    SELECT 
      m.meetingID, 
      m.organizerID, 
      m.title, 
      m.description, 
      m.location, 
      m.startTime, 
      m.endTime, 
      m.status,
      u.userID AS attendeeUserID, 
      u.fullName AS attendeeName, 
      u.email AS attendeeEmail, 
      u.department AS attendeeDepartment, 
      u.role AS attendeeRole, 
      u.office AS attendeeOffice, 
      ma.isConfirmed 
    FROM 
      Meetings m 
    JOIN 
      MeetingAttendees ma ON m.meetingID = ma.meetingID 
    JOIN 
      Users u ON ma.attendeeID = u.userID 
    WHERE 
      m.status = 'pending' 
      AND EXISTS (
        SELECT 1 
        FROM MeetingAttendees ma_sub 
        WHERE ma_sub.meetingID = m.meetingID 
          AND ma_sub.attendeeID = ?
      ) 
    ORDER BY 
      m.startTime`;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Organize meetings by meetingID
    const meetings = data.reduce((acc, row) => {
      const {
        meetingID,
        organizerID,
        title,
        description,
        location,
        startTime,
        endTime,
        status,
        attendeeUserID,
        attendeeName,
        attendeeEmail,
        attendeeDepartment,
        attendeeRole,
        attendeeOffice,
        isConfirmed
      } = row;

      // Check if this meetingID is already added to the accumulator
      if (!acc[meetingID]) {
        // If not, create the meeting structure
        acc[meetingID] = {
          meetingID,
          organizerID,
          title,
          description,
          location,
          startTime,
          endTime,
          status,
          attendees: []
        };
      }

      // Add attendee information to the meeting's attendees array
      acc[meetingID].attendees.push({
        userID: attendeeUserID,
        fullName: attendeeName,
        email: attendeeEmail,
        department: attendeeDepartment,
        role: attendeeRole,
        office: attendeeOffice,
        isConfirmed: Boolean(isConfirmed) 
      });

      return acc;
    }, {});

    // Convert the accumulator object to an array of meetings
    const formattedMeetings = Object.values(meetings);
    return res.status(200).json(formattedMeetings);
  });
};

