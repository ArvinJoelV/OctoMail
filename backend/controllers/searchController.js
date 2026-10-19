const Email = require("../models/Email");
const generateEmbedding = require("../services/embeddingService");

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTextSearchRegex(query) {
    const tokens = query
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(escapeRegex);

    return tokens.length > 0 ? new RegExp(tokens.join("|"), "i") : /./i;
}

function isVectorSearchError(error) {
    const message = error?.message || "";
    return /vector.*index|no such index|search index|atlas.*search|index.*not found|unknown index/i.test(message);
}

function isEmbeddingUnavailableError(error) {
    const message = error?.message || "";
    return /GEMINI_API_KEY|embedding.*returned no values|api key|embedContent/i.test(message);
}

async function fallbackTextSearch(userId, query, limit = 5) {
    const regex = buildTextSearchRegex(query);

    const results = await Email.find({
        userId,
        $or: [
            { subject: { $regex: regex } },
            { summary: { $regex: regex } },
            { body: { $regex: regex } },
            { sender: { $regex: regex } }
        ]
    })
        .sort({ receivedAt: -1 })
        .limit(limit)
        .lean();

    return results.map((email) => ({
        ...email,
        score: typeof email.score === "number" ? email.score : 0.75
    }));
}

async function semanticSearch(req,res){

    try{
        console.log("Inside semantic search ");
        const {query}=req.body;
        if (
            !query ||
            typeof query !== "string" ||
            query.trim().length < 2
        ) {
            return res.status(400).json({
                error: "Invalid query"
            });
        }

        let results;

        try {
            const queryEmbedding = await generateEmbedding(query);
            results = await Email.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: 100,
                        limit:5,
                        filter:{
                            userId: req.user.googleId
                        }
                    }
                },{
                    $project:{
                        subject:1,
                        sender:1,
                        summary:1,
                        priority:1,
                        tasks:1,
                        body:1,
                        receivedAt:1,

                        score:{
                            $meta: "vectorSearchScore"
                        }


                    }
                },
                {

                    $match: {
                        score: {
                            $gte: 0.7
                        }
                    }
                }
            ]);
        } catch (error) {
            if (isEmbeddingUnavailableError(error) || isVectorSearchError(error)) {
                return res.json(await fallbackTextSearch(req.user.googleId, query));
            }

            throw error;
        }

        if (!Array.isArray(results) || results.length === 0) {
            return res.json(await fallbackTextSearch(req.user.googleId, query));
        }

        res.json(results);

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: "Failed Semantic search"
        });
    }
}

async function getSimilarEmails(req,res){
    try{
        const email =await Email.findById(req.params.id);
        if (!email){
            return res.status(404).json({message:"Email not found"});
        }

        let results;

        try {
            results = await Email.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: email.embedding,
                        numCandidates: 100,
                        limit:5,
                        filter:{
                            userId: req.user.googleId
                        }
                    }
                },{
                    $project:{
                        subject:1,
                        sender:1,
                        summary:1,
                        priority:1,
                        tasks:1,
                        body:1,
                        receivedAt:1,

                        score:{
                            $meta: "vectorSearchScore"
                        }


                    }
                },
                {

                    $match: {
                        score: {
                            $gte: 0.7
                        },

                        _id:{
                            $ne:email._id
                        }
                    }
                }
            ]);
        } catch (error) {
            if (isEmbeddingUnavailableError(error) || isVectorSearchError(error)) {
                const regex = buildTextSearchRegex(email.subject || email.summary || "");
                return res.json(await Email.find({
                    _id: { $ne: email._id },
                    userId: req.user.googleId,
                    $or: [
                        { subject: { $regex: regex } },
                        { summary: { $regex: regex } },
                        { body: { $regex: regex } },
                        { sender: { $regex: regex } }
                    ]
                }).sort({ receivedAt: -1 }).limit(5).lean());
            }

            throw error;
        }

        console.log("extracted similar emails succesfully")
        res.json(results);
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            error: "Failed to get Similar Email "
        });
    }
}

module.exports={semanticSearch, getSimilarEmails, isVectorSearchError, buildTextSearchRegex};
