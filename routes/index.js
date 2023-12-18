const express = require("express");
const app = express();

const users = require("./users");
const token = require('./RefreshToken');

const apiUrl = "/api/v1";

app.use(apiUrl, users);
app.use(apiUrl, token);

module.exports = app;