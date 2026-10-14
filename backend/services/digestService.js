const Email =
require("../models/Email");

const Digest =
require("../models/Digest");

const generateLLMResponse =
require("./llmService");

async function createDigest(user){

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const existingDigest =
        await Digest.findOne({

            userId:
                user.googleId,

            date:today

        });

    if(existingDigest){

        return existingDigest;
    }

    const emails =
        await Email.find({

            userId:
                user.googleId,

            processed:true,

            $or:[
                {
                    priority:"High"
                },
                {
                    deadlines:{
                        $exists:true,
                        $ne:[]
                    }
                }
            ]

        })

        .sort({
            receivedAt:-1
        })

        .limit(20);

    if(emails.length===0){

        return null;
    }

    const emailContext =
        emails.map(email =>

`
Subject:
${email.subject}

Summary:
${email.summary}

Priority:
${email.priority}

Tasks:
${email.tasks.join(", ")}

Deadlines:
${email.deadlines.join(", ")}

`
        ).join("\n");

    const prompt =

`
Create a concise morning digest.

Important Emails:

${emailContext}

Requirements:

- Friendly tone
- Mention deadlines
- Mention important tasks
- Maximum 200 words
`;

    const content =
        await generateLLMResponse(
            prompt
        );

    const digest =
        await Digest.create({

            userId:
                user.googleId,

            date:today,

            content

        });

    return digest;
}

module.exports =
createDigest;