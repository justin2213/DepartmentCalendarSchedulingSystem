import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import axios from "axios";
import { useUser } from "./UserContext.jsx";

// Create a context for user meetings
const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({children}) => {
  const session = useSession();
  const {userProfile} = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserEvents = async () => {
    if (!session) return;
    if (!userProfile) return;
    
    try {
      console.log(userProfile.userID)
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/${userProfile.userID}`)
      console.log(response.data);
      setEvents(response.data);
    } catch (err) {
      console.log("Error fetching user meetings", err);
    } finally {
      setLoading(false) 
    }
  };

  useEffect(() => {
    if (session && userProfile) {
     fetchUserEvents();
    }
  }, [session, userProfile]);

  return (
    <EventContext.Provider value = {{events, loading}}>
      {children}
    </EventContext.Provider>
  );
};