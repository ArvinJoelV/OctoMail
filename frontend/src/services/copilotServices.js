import api from "./api";

export async function askCopilot(question, emailId=null){
    const response = await api.post("/copilot/ask", {question, emailId});
    return response.data;
}

export async function clearChat(){
    const response = await api.delete("/copilot/clear");
    return response.data;
}