const Email = require("../models/Email");
const generateEmbedding = require("../services/embeddingService");


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
        
        const queryEmbedding = await generateEmbedding(query);
        const results = await Email.aggregate([
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
        const results = await Email.aggregate([
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

module.exports={semanticSearch, getSimilarEmails};
