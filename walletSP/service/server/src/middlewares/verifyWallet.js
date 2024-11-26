const jwt = require('jsonwebtoken');
require("dotenv").config()

const verifyWallet = async (req, res, next) => {
    const jwtSecret = process.env.JWT_SECRET;
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in the format " Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded.wallet_id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
    
        req.privateKey  = decoded.privateKey;


        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {verifyWallet};
