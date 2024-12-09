import { Container, Row, Col, Button } from "react-bootstrap"; // Import Bootstrap components for layout and styling
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'; // Import Supabase hooks for session management and client access
import React from 'react';

const Login = () => {
  const supabase = useSupabaseClient(); // Get Supabase client instance

  async function microsoftSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure', // Use Azure as the OAuth provider
      options: {
        scopes: 'openid profile email', // Scopes for the OAuth request
        redirectTo: process.env.REACT_APP_REDIRECT_URL, // Redirect URL from environment variable
      }
    });
    if (error) {
      alert("Error logging in to Microsoft provider with Supabase: " + error.message); // Alert user in case of an error
      console.log("Detailed error:", error); // Log detailed error for debugging
      return;
    }
    console.log("Sign in initiated, redirecting to Microsoft..."); // Log sign-in initiation
  }


  return (
      <Container 
      fluid className="bg-dark vh-100 d-flex flex-column justify-content-center align-items-center text-white"
      style={{ 
        background: "linear-gradient(135deg, #0a4275, #022b3a)" 
      }}
      >
        {/* Welcome Text */}
        <Row className="text-center w-100">
          <Col>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Welcome to Meetease!</h1>
          </Col>
        </Row>

        {/* Logo and Tagline */}
        <Row className="text-center w-100 mt-2">
          <Col>
            <img
            src='client/src/pages' 
            alt="App Logo" 
            className="logo.jpg"
            style={{ 
              width: "150px", 
              borderRadius: "50%", 
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" 
            }}
          />
            <h4 className="mt-3" style={{ fontWeight: "300" }}>Scheduling made easy!</h4> {/* Tagline for the application */}
          </Col>
        </Row>

        {/* Login Button */}
        <Row className="text-center mt-4 w-100">
          <Col>
            <Button 
                variant="primary"
                className="rounded-pill px-5" 
                onClick={microsoftSignIn} // Call sign in function when clicked
                aria-label="Login with Microsoft"
                style={{ 
                  background: "linear-gradient(90deg, #1a73e8, #4285f4)", 
                  border: "none", 
                  padding: "0.75rem 2rem", 
                  fontSize: "1.2rem",
                  boxShadow: "0 4px 12px rgba(66, 133, 244, 0.5)" 
                }}
  
            >
              Login with Microsoft
            </Button>
          </Col>
        </Row>
      </Container>
  );
}


export default Login;