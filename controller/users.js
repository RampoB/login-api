const query = require("../database");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function getUsers(req, res) {
    const {nama_depan, email} = req.body;
    try {
        const user = await query(
            `
                SELECT (id, nama_depan, email) FROM register_user;
            `,
            [nama_depan, email]
        );
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(400).json("Not Found");
    }
}

async function Register(req, res) {
    const {nama_depan, nama_belakang, email, password, no_handphone} = req.body;

    try {
        const user = await query(
            `SELECT * FROM register_user WHERE email = ?`, [email]
        );
        if(user.length > 0){
            return res.status(409).json('Email already registered');
        }
        // Hash Password
        const salt = await bcryptjs.genSalt(12);
        const hash = await bcryptjs.hash(password, salt);
        await query(
            `INSERT INTO register_user
            (nama_depan, nama_belakang, email, password, no_handphone)
            VALUES(?,?,?,?,?);`,
            [nama_depan, nama_belakang, email, hash, no_handphone]
        );
        res.status(201).json("Telah dibuat");
    } catch (error) {
        return res.status(400).json(error);
    }
}

async function Login(req, res) {
    const {email, password} = req.body;
    try {
        const user = await query(
            `SELECT * FROM register_user WHERE email = ?`, [req.body.email]
        );
        const match = await bcryptjs.compare(password, user[0].password);
        if (!match) {
            return res.status(401).json('Please check your email and password');
        }
        const userId = user[0].id;
        const email = user[0].email;
        const accessToken = jwt.sign({
            userId, email
        }, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "60s"
        });
        const refreshToken = jwt.sign({
            userId, email
        }, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: "1d"
        });
        await query(
            'UPDATE register_user SET refresh_token=? WHERE id=?',
            [refreshToken,userId]
        );
        res.cookie('refrehToken',refreshToken,{
            httpOnly : true,
            maxAge:24 * 60 * 60 *1000
        });
        res.json({accessToken});
    } catch (error) {
        return res.status(400).json(error);
    }
}

async function Logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(204);
        }
        const user = await query(
            `
                SELECT * FROM register_user WHERE refresh_token =?
            `,
            [refreshToken]
        );
        if (!user[0]) {
            return res.sendStatus(204);
        }
        const userId = user[0].id;
        await query(
            `
            UPDATE register_user SET refresh_token=null WHERE id=?
            `,
            [userId]  
        );
        res.clearCookie("refrehToken");
        return res.sendStatus(200);
}
module.exports = {
    getUsers,
    Register,
    Login,
    Logout
}