import './styles/App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Meetings from './pages/Meetings.jsx';
import Calendar from './pages/Calendar.jsx';
import Login from './pages/Login.jsx';
import { Container } from "react-bootstrap";
import { useSession } from '@supabase/auth-helpers-react';

// Set the layout for the app
const Layout = () => {
  return (
    <div className='App'>
      <div className="Container">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Meetings />
      },
      {
        path: "/calendar",
        element: <Calendar />
      }
    ]
  }
]);

function App() {
  const session = useSession(); // Tokens, when the session exists there is a user
  return (
    <Container fluid className="p-0">
        { session ?
          <RouterProvider router = {router} />
          :
          <Login />
        }
     </Container>
  );
}

export default App;
