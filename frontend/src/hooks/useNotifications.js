import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import mockNotifications from "../mock/mockNotifications";
import { getNotification } from "../services/notificationService";


function useNotifications(){
    const { isAuthenticated } = useAuth();
    const [notifications,setNotifications]= useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]= useState(null);
    useEffect(()=>{
        setLoading(true);
        async function loadNotifications(){
            try{
                if (!isAuthenticated){
                    setNotifications(mockNotifications);
                    return;
                }
                const data = await getNotification();
                setNotifications(data);
            }
            catch(error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        loadNotifications();
    },[isAuthenticated]);
    return {notifications,setNotifications,loading,error};

}

export default useNotifications;
