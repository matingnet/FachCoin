const Block = require('./block');
const crypto = require('crypto');
const { ec } = require('elliptic');
const EC = new ec('secp256k1');


class BlockMiner{
    constructor(minerPk ,  minerReward, index , previousHash , timestamp){
        this.minerPk = minerPk  ; 
        this.minerReward = minerReward ; 
        this.previousHash = previousHash ; 
        this.timestamp = timestamp ;
        this.transactions = {} ; 
        this.index = index ; 
        this.nonce = 0 ; 
    }

    checkSignatureTransaction({ signature, payload }) {
        try {
            const hashData = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
            const publicKey = EC.keyFromPublic(payload.from, 'hex');
            return publicKey.verify(hashData, signature);
        } catch (error) {
            return false; 
        }
    }


    addTransaction(transaction){
        if(!(this.checkSignatureTransaction(transaction))){
            console.error(`Transaction : ${transaction.signature} invalid.`);
            return false  ;
        }
        this.transactions[JSON.stringify(transaction.payload)]  = transaction.signature ; 
        return true ;
    }
    

    
    mine(difficulty){
        let nonce = 0;
        const prefix = '0'.repeat(difficulty);
        
        let hash;
        let toHash;
        
        do {
            toHash = this.minerPk + this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + nonce ;
            hash = crypto.createHash('sha256').update(toHash).digest('hex');
            nonce++;
        } while (!hash.startsWith(prefix));
        nonce = nonce-1 ; 

        const blocknew = new Block(this.minerPk , this.minerReward , this.index , this.timestamp , this.transactions , this.previousHash , nonce) ; 
        return blocknew ;

    }

}

module.exports = BlockMiner ;