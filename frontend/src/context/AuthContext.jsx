import { createContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/authServices";

export const AuthContext= createContext();

function AuthProvider({children}){
    const [user,setUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated]= useState(false);
    
    const [loading,setLoading]=useState(true);


    useEffect(()=>{
        async function checkAuth(){
            try {
                const data = await getCurrentUser();
                setUser(data.user);
                setIsAuthenticated(true);

            }
            catch{
                setUser(null);
                setIsAuthenticated(false);

            }
            finally{
                setLoading(false);
            }
        }
        checkAuth();
    },[]);

    function login(){

    window.location.href="http://localhost:5000/auth/google"
}

async function logout(){

    try { await logoutUser();}
    catch(error){console.log(error);}
    setUser(null);
    setIsAuthenticated(false);

}
    return (
        <AuthContext.Provider value = {{user,isAuthenticated,loading, login,logout}}>

            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;