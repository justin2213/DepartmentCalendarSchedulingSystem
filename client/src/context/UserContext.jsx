import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession} from '@supabase/auth-helpers-react';
import axios from 'axios';

// Create a context for user profile
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const session = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the user profile from Microsoft Graph
  const fetchUserProfile = async () => {
    if (!session) return;
    try {
      // Fetch the user profile from the server using the environment variable
      const userData = await axios.get(`${process.env.API_BASE_URL}/api/users/${session.user.id}`);
      console.log(userData.data); // Log the user data to the console
      setUserProfile(userData.data); // Store the user data in state
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false); // Turn off loading in any case
    }
  };  

  // Fetch the user profile when the session is available
  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ userProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};
