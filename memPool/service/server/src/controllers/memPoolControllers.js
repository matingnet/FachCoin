var events = require('events');
const { setUncaughtExceptionCaptureCallback } = require('process');
var eventEmitter = new events.EventEmitter(); 
const ioClient = require("socket.io-client");
require("dotenv").config()
const blockchainURI = process.env.BLOCKCHAIN_URI;





const transactions = new Set();

const addTransaction = async (req, res) => {
    try {
        const transaction = JSON.parse(req.body.transaction) ;
        transactions.add(JSON.stringify(transaction));
        res.json({ message: "transaction Added" });
        eventEmitter.emit('transactionadded', transaction); // Match event name
    } catch (err) {
        res.status(401).json({ error: "transaction not added" });
    }
};

const removeTransaction = async (transaction) => {
    try {
        if (transactions.has(transaction)) {
            transactions.delete(transaction);
            eventEmitter.emit('transactionremoved', transaction); 
            return true ; 
            
        } else {
            return false ; 
        }
    } catch (error) {
        return false  ; 
    }
};

const getAllTransactions = async (req, res) => {
    try {
        res.json([...transactions]);
    } catch (error) {
        res.status(401).json({ error: "transactions not found" });
    }
};


const blockAdded = async (block) => {
    const transactions = block.data;

    for (const key in transactions) {
        if (transactions.hasOwnProperty(key)) { 
            const transactionString = JSON.stringify({payload : JSON.parse(key) , signature : transactions[key] }) ;
            removeTransaction(transactionString);
        }
    }
};


const blockchainSocket = ioClient(blockchainURI);

blockchainSocket.on("connect", () => {
    console.log("connected to the blockchain");
    blockchainSocket.emit("iAmService");
});

blockchainSocket.on("blockAdded", blockAdded);






module.exports = { addTransaction, getAllTransactions, transactions, eventEmitter };
