const {google } =require("googleapis");


async function fetchHistoryEmails(accessToken,historyId){
    try{
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accessToken
    });
    const gmail = google.gmail({
        version:"v1",
        auth:oauth2Client
    });

    const response = await gmail.users.history.list({
        userId: "me",
        startHistoryId:historyId,
        historyTypes:["messageAdded"]
    });

    return (response.data.history) || [];
}
    catch(err){
   if(
      err.code === 404
   ){
      user.lastHistoryId = null;
      await user.save();

      return syncUser(user);
   }

   throw err;
}
}

module.exports = fetchHistoryEmails; 