import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import mockEmails from "../mock/mockEmails";
import api from "../services/api";
import { getEmails } from "../services/emailService";

function useEmails(){
    const {isAuthenticated } = useAuth();
    const [emails, setEmails]=useState([]);
    const [loading, setLoading]=useState(true);
    const [error,setError]= useState(null);
    useEffect(()=>{
        setLoading(true);
    async function loadEmails(){
        try{
            if (!isAuthenticated){
                setEmails(mockEmails);
                return;
            }
            const data = await getEmails() ;
            setEmails(data);   
            }
        catch(error){
            setError(error.message);
            
        }
        finally{
            setLoading(false);
        }
        
    
    }
    loadEmails();
},[isAuthenticated]);
    return {emails,loading,error};
}

export default useEmails;
