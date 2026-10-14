const {simpleParser} = require("mailparser");
async function parseRawEmail(rawEmail){
    const parsed = await simpleParser(rawEmail);

    return {
        subject: parsed.subject || "",
        sender: parsed.from?.text || "",
        body: parsed.text || "",
        html: parsed.html || "",
        receivedAt: parsed.date || null

    };

}

module.exports=parseRawEmail;