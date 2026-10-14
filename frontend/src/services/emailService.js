
import api from "./api";

export async function getEmails(){
    const response = await api.get("/emails/stored");
    return response.data;
}
export async function getEmailById(id){
    const response= await api.get(`/emails/${id}`);
    return response.data;
}

export async function getSimilarEmails(id){
    const response = await api.get(`/search/${id}/similar`);
    return response.data;
}

export async function getSemanticSearch(message){
    const response = await api.post(`/search/semantic`,{query:message});
    return response.data;
}

export async function processSingleEmail(id){
    const response = await api.post(`/emails/${id}/process`);
    return response.data;
}