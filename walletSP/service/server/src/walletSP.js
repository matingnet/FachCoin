const express = require("express")
const walletRoute = require("./routes/walletRoute");
const walletSP_APP = express();
const bodyParser = require("body-parser");
require("dotenv").config()


const cors = require('cors');

walletSP_APP.use(cors());

walletSP_APP.use(bodyParser.json({ limit: '1mb' }))




walletSP_APP.use("/wallet/api/v1", walletRoute);




module.exports = {walletSP_APP} ; 