function getHeader(headers,name){
    const header = headers.find(
        h=> h.name === name
    );
    return header ? header.value :"";
}
function decodeBase64(data) {

    if (!data) return "";

    return Buffer.from(
        data.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
    ).toString("utf-8");
}

function extractBody(payload) {

    let body = "";

    function traverseParts(parts) {

        for (let part of parts) {

            // Prefer plain text
            if (
                part.mimeType === "text/plain" &&
                part.body?.data
            ) {

                body += decodeBase64(part.body.data);

            }

            // Fallback HTML
            else if (
                part.mimeType === "text/html" &&
                part.body?.data &&
                body.length === 0
            ) {

                body += decodeBase64(part.body.data);
            }

            // Recursive traversal
            if (part.parts) {
                traverseParts(part.parts);
            }
        }
    }

    // Direct body
    if (payload.body?.data) {

        body += decodeBase64(payload.body.data);

    }

    // Multipart traversal
    if (payload.parts) {

        traverseParts(payload.parts);
    }

    return body;
}

module.exports={getHeader,extractBody};
