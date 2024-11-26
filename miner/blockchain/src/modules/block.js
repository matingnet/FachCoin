const crypto = require('crypto');
const { ec } = require('elliptic');
const EC = new ec('secp256k1');
class Block {
    constructor(minerpk , minerReward ,index , timestamp, data, previousHash = '', nonce = 0) {
        this.minerpk = minerpk ; 
        this.minerReward = minerReward ; 
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = this.calculateHash();

    }

    getHash(){
        return this.hash;
    }

    

    getPreviousHash() {
        return this.previousHash;
    }

    calculateHash() {
        const toHash = this.minerpk + this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce ; 
        const res_hash = crypto.createHash('sha256').update(toHash).digest('hex');
        return res_hash ;
    }


    checkBlock(difficulty) {
        // Example difficulty check: Hash must start with 'difficulty' number of zeros
        const prefix = '0'.repeat(difficulty);
      
        if (!this.hash.startsWith(prefix)) {
            console.error(`******** false proof of work *******`);
            return false; // Invalid block
        }
        console.log(`PoW Verified : ${this.hash}`);
        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                const signature = this.data[key]; 
                const payload = JSON.parse(key); 

                if (!this.checkSignatureTransaction({signature,payload})) {
                    return false; // Invalid transaction
                }
            }
        }
        return true; // All checks passed
    }

    checkSignatureTransaction({ signature, payload }) {
        try {
            const hashData = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
            const publicKey = EC.keyFromPublic(payload.from, 'hex');
            return publicKey.verify(hashData, signature);
        } catch (error) {
            console.error(`Transaction : ${signature} : not verified`);
            return false; // Return false if there's an error
        }
    }
}

module.exports = Block;
