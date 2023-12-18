const express = require("express");
const router = express.Router();
const {refreshToken} = require("../controller/RefreshToken");

router.get('/token',refreshToken)
module.exports = router;