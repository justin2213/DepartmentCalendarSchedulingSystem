import { Container, Row, Col, Button } from "react-bootstrap"; // Import Bootstrap components for layout and styling
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'; // Import Supabase hooks for session management and client access

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
    <Container fluid className="bg-dark vh-100 d-flex flex-column justify-content-center align-items-center text-white">
      {/* Container with dark background that takes full height */}
      <Row className="text-center w-100">
        <Col>
          <h1>Department Scheduling System</h1> {/* Application name */}
        </Col>
      </Row>
      <Row className="text-center w-100 mt-2">
        <Col>
          <h4>Scheduling made easy!</h4> {/* Tagline for the application */}
        </Col>
      </Row>
      <Row className="text-center mt-4 w-100">
        <Col>
          <Button 
              variant="primary"
              className="rounded-pill me-3 px-5" 
              onClick={microsoftSignIn} // Call sign in function when clicked
          >
              Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
}


export default Login;
