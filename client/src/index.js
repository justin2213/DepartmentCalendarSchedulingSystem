import React from 'react'; // Core React library for building user interfaces
import ReactDOM from 'react-dom/client'; // Provides DOM-specific methods for rendering
import App from './App.jsx'; // Main application component
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS for styling
import { createClient } from '@supabase/supabase-js'; // Supabase client 
import { SessionContextProvider } from '@supabase/auth-helpers-react'; // Context provider for session management
import { UserProvider } from './context/UserContext.jsx'; // Context provider for user state management
import { MeetingsProvider } from './context/MeetingsContext.jsx'; // Context provider for meetings state management

// Create a Supabase client for managing authentication and session state
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY 
);

// Create and render the root of the React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}> {/* Provides session information across the application */}
      <UserProvider> {/* Provides user information across the application */}
        <MeetingsProvider> {/* Provides meeting information across the application */}
          <App /> {/* Main application component */}
        </MeetingsProvider>
      </UserProvider>
    </SessionContextProvider>
  </React.StrictMode>
);
