import api from "./api";

export async function getTodayDigest(){
    response = await  api.get("/digest/today");
    return response.data;

}

