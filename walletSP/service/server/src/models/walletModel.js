const mongoose = require('mongoose');


const WalletSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true , 
        unique: true
    },
    privateKey: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
});


module.exports = mongoose.model('Wallet', WalletSchema);
