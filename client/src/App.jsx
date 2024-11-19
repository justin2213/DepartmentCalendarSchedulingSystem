import './styles/App.css'; // Importing custom styles for the application
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom"; // React Router for client-side routing
import NavigationBar from './components/NavigationBar.jsx'; // Navigation bar component
import Meetings from './pages/Meetings.jsx'; // Meetings page component
import Calendar from './pages/Calendar.jsx'; // Calendar page component
import Login from './pages/Login.jsx'; // Login page component 
import { Container } from "react-bootstrap"; // Bootstrap container 
import { useSession } from '@supabase/auth-helpers-react'; // Hook to manage user session state


// Set the layout for the app
const Layout = () => {
  return (
    <div className='App'>
      <NavigationBar /> {/* Renders the navigation bar for the application */}
      <div className="Container">
        <Outlet /> {/* Placeholder for rendering child routes */}
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // The root layout of the app
    children: [
      {
        path: "/", // Default route renders the Meetings page
        element: <Meetings />
      },
      {
        path: "/calendar", // Route for the Calendar page
        element: <Calendar />
      }
    ]
  }
]);

function App() {
  const session = useSession(); // Retrieve session information to determine user authentication status
  return (
    <Container fluid className="p-0">
        { session ? // Check if a session exists
          <RouterProvider router={router} /> // Render the router if the user is authenticated
          :
          <Login /> // Render the Login page if there is no session
        }
     </Container>
  );
}

export default App;
