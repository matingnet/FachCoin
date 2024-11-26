const axios = require("axios");
const { trace } = require("../routes/walletRoute");
require("dotenv").config();

const diffuseTransaction = async (data, res) => {
    const uri = `${process.env.MEMPOOL_URI}/mempool/api/v1/addtransaction`;

    try {
        await axios.post(uri, { transaction: JSON.stringify(data) });
        res.json({state : "added to memPool"})
        return true; // Return response data for further use if needed
    } catch (error) {
        res.status.json({state : "not added to memPool"})
        return false ;
    }
};

module.exports = { diffuseTransaction };
