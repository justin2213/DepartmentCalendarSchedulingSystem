import { db } from "../db.js"

export const getUser = (req,res) => {
  // Get the user from the database
  const q = "SELECT * FROM Users WHERE userID = ?"

  db.query(q,[req.params.id], (err,data)=> {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  })
}

export const getUsers = (req, res) => {
  // Define the query
  const q = "SELECT * FROM Users WHERE role != 'Student'";

  // Execute the query
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching users:", err); // Log the error for debugging
      return res.status(500).json({ error: "An error occurred while fetching users." });
    }
    return res.status(200).json(data);
  });
};

export const getAvailability = (req, res) => {
  const { userIds, duration } = req.body;
  //console.log("Get Availability Called");
  //console.log("UserIDs");
  //console.log(userIds);

  if (!userIds || !duration) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  // Query to fetch user availability
  const availabilityQuery = `
    SELECT userID, startTime, endTime, dayOfWeek
    FROM UserAvailability
    WHERE userID IN (?)
    ORDER BY dayOfWeek, startTime
  `;

  // Query to fetch events a user is attending
  const eventsQuery = `
    SELECT ea.attendeeID AS userID, e.eventStart, e.eventEnd
    FROM EventAttendees ea
    JOIN Events e ON ea.eventID = e.eventID
    WHERE ea.attendeeID IN (?) 
      AND ea.isConfirmed = 1
      AND DATE(e.eventStart) >= '2024-11-18'
    ORDER BY e.eventStart
  `;


  db.query(availabilityQuery, [userIds], (availabilityErr, availabilityData) => {
    if (availabilityErr) {
      console.error("Error fetching availability:", availabilityErr);
      return res.status(500).json({ error: "An error occurred while fetching availability." });
    }

    db.query(eventsQuery, [userIds], (eventsErr, eventsData) => {
      if (eventsErr) {
        console.error("Error fetching events:", eventsErr);
        return res.status(500).json({ error: "An error occurred while fetching events." });
      }

      if (availabilityData.length === 0) {
        return res.status(200).json([]);
      }
     
      
      console.log(eventsData);


      // Reduing the availability object to find overlapping availabilty between participants
      console.log(availabilityData);
      console.log("Reducing Data");
      const availabilityByWeekDay = availabilityData.reduce((acc, { dayOfWeek, startTime, endTime }) => {
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = { start: startTime, end: endTime };
        } else {
          acc[dayOfWeek].start = acc[dayOfWeek].start > startTime ? acc[dayOfWeek].start : startTime; // latest start time
          acc[dayOfWeek].end = acc[dayOfWeek].end < endTime ? acc[dayOfWeek].end : endTime;         // earliest end time
        }
        return acc;
      }, {});
      
      // Convert the result to an array of objects
      const availability = Object.entries(availabilityByWeekDay).map(([dayOfWeek, { start, end }]) => ({
        dayOfWeek,
        startTime: start,
        endTime: end
      }));
      
      //console.log(availability);
      
      // Get all dates that people can meet on
      const getDates = () => {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear(), 10, 18); // Set the date to November 18th (month 10 = November)
        const endDate = new Date(currentDate.getFullYear(), 11, 7); // December 6th
        console.log("Current Date: ")
        console.log(currentDate)
      
        const dates = [];
        while (currentDate <= endDate) {
          // Add the current date to the array
          dates.push(new Date(currentDate)); // Create a new Date object to avoid mutation
      
          // Move to the next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      
        return dates;
      };
      const dates = getDates()
      const getDayOfWeek = (date) => {
        const daysOfWeek = [
          'Sunday', 
          'Monday', 
          'Tuesday', 
          'Wednesday', 
          'Thursday', 
          'Friday', 
          'Saturday'
        ];
        return daysOfWeek[date.getDay()];
      }

      const availabilityByDay = [];
      dates.forEach((date) => {
        const dayOfWeek = getDayOfWeek(date); // Get the weekday
        const match = availability.find((a) => a.dayOfWeek === dayOfWeek); // Find matching availability
        if (match) {
          availabilityByDay.push({
            date: date.toISOString(),
            startTime: match.startTime, // Use matching availability or null
            endTime: match.endTime
          });
        }
      });

      //console.log("Availability By Day")
      //console.log(availabilityByDay);

      //console.log("Events");
      //console.log(eventsData)
      

      function insertEvent(availability, event) {
        const updatedTimes = [];
    
        // Convert event start and end times to time strings (HH:MM:SS)
        const eventStart = new Date(event.eventStart);
        const eventEnd = new Date(event.eventEnd);
        
          // Hardcode the Pennsylvania (Eastern Time Zone) offset, e.g., UTC-5 for standard time.
          const timezoneOffset = -5; // Pennsylvania Standard Time (Eastern Standard Time, UTC-5)
        
          // Apply the hardcoded offset to the date
          eventStart.setHours(eventStart.getHours() + timezoneOffset);
          eventEnd.setHours(eventEnd.getHours() + timezoneOffset);

    
        // Extract only the time portion (HH:MM:SS)
        const eventStartTime = eventStart.toISOString().slice(11, 19);  // "HH:MM:SS"
        const eventEndTime = eventEnd.toISOString().slice(11, 19);      // "HH:MM:SS"

        console.log(eventStartTime)
        console.log(eventEndTime)
        for (const time of availability.times) {
            // Compare event time with availability time slots
            if (eventEndTime <= time.start || eventStartTime >= time.end) {
                // Case 1: The event does not overlap with this time slot
                updatedTimes.push(time); // Keep the time slot as-is
            } else {
                // Case 2: The event overlaps with this time slot
                // If the event starts after this time slot begins, add the first segment
                if (eventStartTime > time.start) {
                    updatedTimes.push({ start: time.start, end: eventStartTime });
                }
                // If the event ends before this time slot ends, add the second segment
                if (eventEndTime < time.end) {
                    updatedTimes.push({ start: eventEndTime, end: time.end });
                }
            }
        }
    
        // Update availability with the new times
        availability.times = updatedTimes;
    }
    


      function areDatesEqual(date1, date2) {
        console.log(date1)
        console.log(date2)
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        console.log(d1)
        console.log(d2)
    
        return (
            d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate()
        );
      }

      const availabilityForMeetings = availabilityByDay.map((day) => {
        const eventsForDay = eventsData.filter(event => areDatesEqual(event.eventStart, day.date));
        const availabilityForDay = { date: day.date, times: [{start: day.startTime, end: day.endTime}]}
        console.log("Initial Availability")
        console.log(availabilityForDay)
        for(const event of eventsForDay) {
          insertEvent(availabilityForDay, event);
          console.log("Inserting Event: ", event)
          console.log("Updated Availability: ", availabilityForDay)
        }
        return availabilityForDay
      });

      //console.log("Availability For Meeting")
      //console.log(availabilityForMeeting[0])
    
      // Helper function to convert time string 'HH:MM:SS' to total minutes
      function timeToMinutes(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 60 + minutes + seconds / 60;
      }

      availabilityForMeetings.forEach((day) => {
        day.times = day.times.filter(timeSlot => {
            const startMinutes = timeToMinutes(timeSlot.start);
            const endMinutes = timeToMinutes(timeSlot.end);
            
            // Calculate the duration in minutes
            const durationInMinutes = endMinutes - startMinutes;

            // Filter time slots based on the duration
            return durationInMinutes > duration;
        });
      });

      // Helper function to convert total minutes back to 'HH:MM:SS' format
      function minutesToTime(minutes) {
        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        const secs = Math.floor((minutes % 1) * 60);
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      // Function to slice times into intervals of 'duration' minutes
      function sliceTimesByDuration(availability, duration) {
        availability.forEach((day) => {
            day.times = day.times.flatMap(timeSlot => {
                const startMinutes = timeToMinutes(timeSlot.start);
                const endMinutes = timeToMinutes(timeSlot.end);
                
                const intervals = [];
                
                // Generate intervals of 'duration' minutes starting from 'start' to 'end'
                for (let current = startMinutes; current + duration <= endMinutes; current += duration) {
                    intervals.push(minutesToTime(current));
                }
                
                return intervals; // Return all generated intervals
            });
        });
      }


      sliceTimesByDuration(availabilityForMeetings, duration);

      console.log(availabilityForMeetings);

      return res.status(200).json(availabilityForMeetings)

    });
  });
};

