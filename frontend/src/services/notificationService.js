import api from "./api";

export async function getNotification(){
    const response = await  api.get("/notifications");
    return response.data;


}

export async function getUnreadCount(){
    const response = await api.get("/notifications/count");
    return response.data;

}

export async function markNotificationRead(id){
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;


}

export async function markAllNotificationRead(){
    const response = await api.patch("/notifications/read-all");
    return response.data;
}