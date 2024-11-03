import { Container, Row, Col, Button } from "react-bootstrap";
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';

const Login = () => {
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  async function microsoftSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'openid profile email', // Adjust scopes as needed
        redirectTo: process.env.REACT_APP_REDIRECT_URL, // Use the environment variable
      }
    });
    if (error) {
      alert("Error logging in to Microsoft provider with Supabase: " + error.message);
      console.log("Detailed error:", error);
      return;
    }
    console.log("Sign in initiated, redirecting to Microsoft...");
  }

  return (
    <Container fluid className="bg-dark vh-100 d-flex flex-column justify-content-center align-items-center text-white">
      <Row className="text-center w-100">
        <Col>
          <h1>MeetEase</h1>
        </Col>
      </Row>
      <Row className="text-center w-100 mt-2">
        <Col>
          <h4>Scheduling made easy!</h4>
        </Col>
      </Row>
      <Row className="text-center mt-4 w-100">
        <Col>
          <Button 
              variant="primary" 
              className="rounded-pill me-3 px-5"
              onClick={microsoftSignIn}
          >
              Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
