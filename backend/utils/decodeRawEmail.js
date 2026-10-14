function decodeRawEmail(raw){
    return Buffer.from(raw.replace(/-/g, "+")
           .replace(/_/g, "/"),
        "base64").toString("utf8");
}

module.exports =decodeRawEmail;