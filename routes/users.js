const express = require("express");
const router = express.Router();
const {getUsers,Register, Login, Logout} = require("../controller/users");
const {verifyToken} = require("../middleware/VerifyToken.js");

router.get('/users',verifyToken ,getUsers);
router.post('/users', Register);
router.post('/login', Login)
router.delete('/logout',Logout);

module.exports = router;