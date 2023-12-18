const query = require("../database");
const jwt = require("jsonwebtoken");

async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const user = await query(
            `
                SELECT * FROM register_user WHERE refresh_token =?
            `,
            [refreshToken]
        );
        if (!user[0]) {
            return res.sendStatus(403);
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
            if (err) {
                return res.sendStatus(403);
            }
            const userId = user[0].id;
            const email = user[0].email;
            const accessToken = jwt.sign({
                userId, email
            }, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:'15s'
            });
            res.json({accessToken})
        });
    } catch (error) {
        return res.status(400).json("Something Went Wrong and I absolutely no have any idea");
    }
}

module.exports = {
    refreshToken
}