import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import axios from "axios";
import { useUser } from "./UserContext.jsx";

// Create a context for user meetings
const MeetingContext = createContext();

export const useMeetings = () => useContext(MeetingContext);

export const MeetingsProvider = ({children}) => {
  const session = useSession();
  const {userProfile} = useUser();
  const [confirmedUserMeetings, setConfirmedUserMeetings] = useState([]);
  const [pendingUserMeetings, setPendingUserMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfirmedUserMeetings = async () => {
    if (!session) return;
    if (!userProfile) return;
    
    try {
      // Fetch the confirmed user meetings from the server
      const meetings = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/meetings/${userProfile.userID}`)
      console.log(meetings.data);
      setConfirmedUserMeetings(meetings.data);
    } catch (err) {
      console.log("Error fetching user meetings", err);
    } finally {
      setLoading(false) 
    }
  };

  const fetchPendingUserMeetings = async () => {
    if (!session) return;
    if (!userProfile) return;
    
    try {
      // Fetch the pending user meetings from the server
      const meetings = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/meetings/pending/${userProfile.userID}`)
      console.log(meetings.data);
      setPendingUserMeetings(meetings.data);
    } catch (err) {
      console.log("Error fetching user meetings", err);
    } finally {
      setLoading(false) 
    }
  };


  useEffect(() => {
    if (session && userProfile) {
      fetchConfirmedUserMeetings();
      fetchPendingUserMeetings();
    }
  }, [session, userProfile]);

  return (
    <MeetingContext.Provider value = {{confirmedUserMeetings, pendingUserMeetings, loading}}>
      {children}
    </MeetingContext.Provider>
  );
};