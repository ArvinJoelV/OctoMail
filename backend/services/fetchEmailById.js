const {google } =require("googleapis");


async function fetchEmailById(accessToken,messageId){
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accessToken
    });
    const gmail = google.gmail({
        version:"v1",
        auth:oauth2Client
    });

    const response = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format:"raw"
    });

    return  response.data;

}

module.exports = fetchEmailById; 