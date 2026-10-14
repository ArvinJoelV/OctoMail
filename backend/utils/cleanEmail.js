const {convert} = require("html-to-text")

function cleanEmailTexts(text){
    if (!text) return "";
    let cleaned=convert(text,{
        wordwrap: false
    });

    cleaned=cleaned.replace(/https?:\/\/\S+/g, "");
    cleaned=cleaned.replace(/\s+/g, " ").trim();
    return cleaned;
}

module.exports=cleanEmailTexts;
