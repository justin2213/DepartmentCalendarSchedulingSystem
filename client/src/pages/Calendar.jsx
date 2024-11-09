import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext.jsx';
import ViewMeeting from '../components/ViewMeeting.jsx';
import { createEventsServicePlugin } from '@schedule-x/events-service';

const Calendar = () => {
    const { events, loading } = useEvents();
    const [showMeeting, setShowMeeting] = useState(false);
    const [viewedEvent, setViewedEvent] = useState(null);
    const eventsServicePlugin = createEventsServicePlugin();

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const formatDateTime = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const calendar = useCalendarApp({
        calendars: {
            meetings: {
                colorName: 'meetings',
                lightColors: {
                    main: '#f9d71c',
                    container: '#fff5aa',
                    onContainer: '#594800',
                },
                darkColors: {
                    main: '#fff5c0',
                    onContainer: '#fff5de',
                    container: '#a29742',
                },
            },
            class: {
                colorName: 'class',
                lightColors: {
                    main: '#f91c45',
                    container: '#ffd2dc',
                    onContainer: '#59000d',
                },
                darkColors: {
                    main: '#ffc0cc',
                    onContainer: '#ffdee6',
                    container: '#a24258',
                },
            },
            officeHours: {
                colorName: 'officeHours',
                lightColors: {
                    main: '#1cf9b0',
                    container: '#dafff0',
                    onContainer: '#004d3d',
                },
                darkColors: {
                    main: '#c0fff5',
                    onContainer: '#e6fff5',
                    container: '#42a297',
                },
            },
        },
        callbacks: {
            onEventClick(calendarEvent) {
                const event = events.find(event => event.eventID === calendarEvent.id);
                setViewedEvent(event || null);
                setShowMeeting(true);
            }
        },
        firstDayOfWeek: 0,
        dayBoundaries: {
            start: '06:00',
            end: '22:00'
        },
        defaultView: viewMonthGrid.name,
        minDate: '2024-08-01',
        maxDate: '2024-12-31',
        views: [
            createViewMonthAgenda(),
            createViewMonthGrid(),
            createViewWeek(),
            createViewDay(),
        ],
        events: events.map((event) => ({
            id: event.eventID,
            start: formatDateTime(event.eventStart),
            end: formatDateTime(event.eventEnd),
            title: event.eventTitle,
            people: event.attendees.map(attendee => attendee.fullName),
            location: event.eventLocation,
            calendarId: event.eventType,
        })),
        selectedDate: getCurrentDate(),
    }, [eventsServicePlugin]);

    useEffect(() => {
        if (events && calendar.eventsService) {
            calendar.eventsService.set(events.map((event) => ({
                id: event.eventID,
                start: formatDateTime(event.eventStart),
                end: formatDateTime(event.eventEnd),
                title: event.eventTitle,
                people: event.attendees.map(attendee => attendee.fullName),
                location: event.eventLocation,
                calendarId: event.eventType,
            })));
        }
    }, [events, calendar.eventsService]);

    return (
        <Container fluid className="vh-100 d-flex flex-column align-items-center">
            <Row className='w-100 pt-3 m-5' style={{ height: '75%' }}>
                <Col style={{ height: '100%', overflowY: 'auto' }}>
                    <ScheduleXCalendar calendarApp={calendar} />
                </Col>
            </Row>
            <ViewMeeting show={showMeeting} onHide={() => setShowMeeting(false)} event={viewedEvent} />
        </Container>
    );
};

export default Calendar;
