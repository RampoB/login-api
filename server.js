const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = require("./routes/index.js");
const cors = require("cors");
const app = express();
dotenv.config();

const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})