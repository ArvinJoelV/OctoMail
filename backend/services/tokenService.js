const axios = require("axios");

async function refreshAccessToken(refreshToken){
    try {
    const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        }
    );
    return response.data.access_token;
} catch(err) {

    console.log(
        err.response?.data || err.message
    );

    throw err;
}
}
module.exports =refreshAccessToken;