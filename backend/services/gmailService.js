const {google } =require("googleapis");

async function fetchEmails(accessToken){
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accessToken
    });
    const gmail = google.gmail({
        version:"v1",
        auth:oauth2Client
    });

    const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 15
    });

    const messages=  response.data.messages || [];

    const fullEmails = await Promise.all(

        messages.map(
            async(message)=>
            {
                const email=await gmail.users.messages.get({
                    userId:"me",
                    id: message.id,
                    format: "raw"
                });
                return email.data;
            }
        )
    )
    return fullEmails;
}

module.exports = fetchEmails; 