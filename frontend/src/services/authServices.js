import api from "./api";

export async function getCurrentUser(){
    const response= await api.get("/auth/me");
    return response.data;
}

export async function logoutUser(){
    const response= await api.get("/auth/logout");
    return response.data;
    
}