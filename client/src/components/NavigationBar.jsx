import { Link } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button'; 
import { useState } from 'react';
import CreateMeeting from './CreateMeeting.jsx';
import {useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '../context/UserContext.jsx'


const NavigationBar = () => {
    const [showCreateMeeting, setShowCreateMeeting] = useState(false);
    const supabase = useSupabaseClient();
    const {userProfile} = useUser();

    async function signOut() {
        await supabase.auth.signOut();
    }

    return ( 
        <Navbar fixed="top" expand="lg" bg="dark" data-bs-theme="dark" className="py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fs-3">MeetEase</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <div>
                            <Button 
                                variant="primary" 
                                className="rounded-pill me-3 px-3" 
                                onClick={() => setShowCreateMeeting(true)} 
                            >
                                + Create
                            </Button>
                        </div>
                        <Nav.Link as={Link} to="/meetings" className="me-3">Meetings</Nav.Link>
                        <Nav.Link as={Link} to="/calendar" className="me-3">Calendar</Nav.Link>
                        <NavDropdown title={userProfile ? userProfile.fullName : 'shh'} id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/">Availability</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Button} onClick={signOut}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <CreateMeeting show={showCreateMeeting} onHide={() => setShowCreateMeeting(false)} />
        </Navbar>
    );
}

export default NavigationBar;
