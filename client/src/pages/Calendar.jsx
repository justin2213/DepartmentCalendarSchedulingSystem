import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useMeetings } from '../context/MeetingsContext';

const Calendar = () => {
    const { confirmedUserMeetings } = useMeetings();

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        console.log(`${year}-${month}-${day} ${hours}:${minutes}`)
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    

    const formatDateTime = (isoDateString) => {
        // Convert the ISO string to a Date object
        const date = new Date(isoDateString);
        
        // Extract the year, month, day, hours, and minutes
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0'); // Pad with leading zero if necessary
        const hours = String(date.getHours()).padStart(2, '0'); // Pad with leading zero if necessary
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad with leading zero if necessary
    
        console.log(`${year}-${month}-${day} ${hours}:${minutes}`);
        // Format and return the desired output
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const calendar = useCalendarApp({
        views: [
            createViewMonthAgenda(),
            createViewMonthGrid(),
            createViewWeek(),
            createViewDay(),
        ],
        events: confirmedUserMeetings?.map((meeting) => {
            console.log(meeting.startTime, meeting.endTime); // Log start and end times
            return {
                id: meeting.meetingID,
                start: formatDateTime(meeting.startTime),
                end: formatDateTime(meeting.endTime),
                title: meeting.title,
                people: meeting.attendees.map(attendee => attendee.fullName),
                location: meeting.location,
                description: meeting.description
            };
        }),        
        selectedDate: getCurrentDate(),
    });

    return ( 
        <Container fluid className="vh-100 d-flex flex-column align-items-center">
            <Row className="w-100 pt-3 m-5 px-5">
                <Col>
                    <h2><strong>Calendar</strong></h2>
                </Col>
            </Row>
            
            <Row className='w-100' style={{ height: '75%' }}>
                <Col style={{ height: '100%', overflowY: 'auto' }}>
                    <ScheduleXCalendar calendarApp={calendar} />
                </Col>
            </Row>
        </Container>
    );
};

export default Calendar;
