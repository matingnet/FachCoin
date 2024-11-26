const mongoose = require("mongoose"); 
require('dotenv').config()  



const connectDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URI_WALLETSP)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.log(error);
                reject();  
            });
    });
};


module.exports = connectDB ; 