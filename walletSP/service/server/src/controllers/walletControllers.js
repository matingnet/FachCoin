const Wallet = require("../models/walletModel")
const { ec } = require('elliptic');
const crypto = require('crypto');
const EC = new ec('secp256k1');
const jwt = require('jsonwebtoken');
const { diffuseTransaction } = require("../utils/transactions");
const ioClient = require("socket.io-client");
require("dotenv").config()
const blockchainURI = process.env.BLOCKCHAIN_URI;

var idTransaction = 1 ; 


const createWallet = async (req, res) => {
    const password = req.body.password;
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic('hex');
    const jwtSecret = process.env.JWT_SECRET;

    try {
        const newWallet = new Wallet({ publicKey, privateKey, password });
        const savedWallet = await newWallet.save();
        const token = jwt.sign(
            { wallet_id: savedWallet._id, publicKey: savedWallet.publicKey, privateKey: savedWallet.privateKey },
            jwtSecret
        );
        res.status(201).json({
            token,
            message: 'Wallet created successfully',
            publicKey: savedWallet.publicKey
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while creating the Wallet',
            error: error.message
        });
    }
}

const affectTransaction = async (req, res) => {
    const id = idTransaction ;
    idTransaction = idTransaction + 1 ; 
    const amount = Number(req.body.amount);
    const receiver = req.body.receiver;
    const privateKeyString = req.privateKey;
    const keyPair = EC.keyFromPrivate(privateKeyString, 'hex');
    const publicKey = keyPair.getPublic('hex'); // Generate public key from the private key
    const payload = { id, amount, from: publicKey, to: receiver, timeStamp: Date.now() };
    const transactionData = JSON.stringify(payload);
    const hashData = crypto.createHash('sha256').update(transactionData).digest('hex');
    const signature = keyPair.sign(hashData, 'base64').toDER('hex');
    const toSend = { payload , signature} ; 
    diffuseTransaction(toSend , res);


};

const walletLogin = async (req, res) => {

    const { publicKey, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    try {
        const wallet = await Wallet.findOne({ publicKey });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        const isMatch = password === wallet.password;
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { wallet_id: wallet._id, publicKey: wallet.publicKey, privateKey: wallet.privateKey },
            jwtSecret
        );

        res.json({
            token,
            id: wallet._id,
            publicKey: wallet.publicKey,

        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }

}

const verifyLogin = async (req, res) => {
    const jwtSecret = process.env.JWT_SECRET;
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in the format " Bearer <token>"

    if (!token) {
        return res.status(401).json({ isAuthenticated: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded.wallet_id) {
            return res.status(401).json({ isAuthenticated: false, message: 'Not authorized' });
        }

        const userWallet = await Wallet.findById(decoded.wallet_id);

        res.send({ isAuthenticated: true, address: decoded.publicKey, balance: userWallet.balance });
    } catch (err) {
        res.status(401).json({ isAuthenticated: false, message: 'Invalid token' });
    }
}

const blockAdded = async (block) => {
    try {
        const balanceUpdates = new Map();

        // Add miner's reward to balanceUpdates map
        if (block.minerpk) {
            balanceUpdates.set(
                block.minerpk,
                (balanceUpdates.get(block.minerpk) || 0) + block.minerReward
            );
        }

        // Accumulate balance changes for each transaction
        Object.keys(block.data).forEach((key) => {
            const transaction = JSON.parse(key);

            // Deduct amount from sender
            balanceUpdates.set(
                transaction.from,
                (balanceUpdates.get(transaction.from) || 0) - transaction.amount
            );

            // Add amount to receiver
            balanceUpdates.set(
                transaction.to,
                (balanceUpdates.get(transaction.to) || 0) + transaction.amount
            );
        });

        // Apply balance updates to each wallet in a single operation per wallet
        await Promise.all([...balanceUpdates.entries()].map(async ([publicKey, balanceChange]) => {
            const wallet = await Wallet.findOne({ publicKey });
            if (wallet) {
                wallet.balance += balanceChange;
                await wallet.save();
            }
        }));

    } catch (error) {
        console.error("Error processing block:", error.message);
    }
};







const blockchainSocket = ioClient(blockchainURI);

blockchainSocket.on("connect", () => {
    console.log("connected to the blockchain");
    blockchainSocket.emit("iAmService");
});

blockchainSocket.on("blockAdded", blockAdded);





module.exports = { createWallet, affectTransaction, walletLogin, verifyLogin }; 