const Digest =
require("../models/Digest");

async function getTodayDigest(
    req,
    res
){

    try{

        const today =
            new Date()
            .toISOString()
            .split("T")[0];

        const digest =
            await Digest.findOne({

                userId:
                    req.user.googleId,

                date:today

            });

        res.json(
            digest
        );

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            error:
                "Failed to fetch digest"
        });

    }

}

module.exports = {
    getTodayDigest
};