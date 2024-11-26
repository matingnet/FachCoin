const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const { connectToNodes, handleServer } = require("./networkController");
require("dotenv").config();
const blockchain = require("./../modules/blockchain") ; 
const Block = require("./../modules/block")
const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


function convertToBlockInstance(plainObject) {
    return new Block(
        plainObject.minerpk,
        plainObject.minerReward,
        plainObject.index,
        plainObject.timestamp,
        plainObject.data,
        plainObject.previousHash,
        plainObject.nonce
    );
}


app.post("/blockchain/addBlock", (req, res) => {
    const newblock = convertToBlockInstance(req.body.block)
    blockchain.addBlock(newblock) ; 
    
    res.send({message : "the block added to proccess."});
});

app.post("/blockchain/metadata", (req, res) => {
    res.send({difficulty : blockchain.difficulty , reward : blockchain.reward , latestHash : blockchain.getLatestHash()});
});


connectToNodes();

handleServer(io);





module.exports = {server}