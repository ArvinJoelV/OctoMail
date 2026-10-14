import { useState,useEffect } from "react";
import useAuth from "../context/useAuth";
import { getTodayDigest } from "../services/digestServices";
import mockDigest from "../mock/mockDigest";


function useDigest(){
    const { isAuthenticated }=useAuth();
    const [digest, setDigest]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error, setError]=useState(null);
    useEffect(()=>{
        setLoading(true);
        async function loadDigest(){
            try{
            if(isAuthenticated){
                const data = await getTodayDigest();
                setDigest(data);
                return;
            }
            setDigest(mockDigest);
            }
            catch (error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        loadDigest();
    },[isAuthenticated]);
    return { digest, loading, error };


}

export default useDigest;
