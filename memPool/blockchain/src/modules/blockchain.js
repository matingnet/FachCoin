// src/blockchain.js
const Block = require('./block');
var events = require('events');


class Blockchain {
    constructor(reward,difficulty) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.reward = reward;
        this.UTXO_balances = {"0" : this.reward } , 
        this.UTXO_transactions = new Set(),  
        this.eventBlockChain = new events.EventEmitter(); 
    }

    // Genesis block is the first block in the chain
    createGenesisBlock() {
        return new Block( "0" , 0 , 0 , 0 ,{});
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getLatestHash() {
        return this.getLatestBlock().getHash();
    }

    // Add a new block to the chain
    addBlock(newBlock) {

        if (this.getLatestHash() == newBlock.getPreviousHash()){
            if (newBlock.checkBlock(this.difficulty) && (newBlock.minerReward == this.reward)) {
                const UTXO_tmp_balances = {}
                const transactions = newBlock.data ; 
                for (const payload_str in  transactions) {
                    const payload = JSON.parse(payload_str) ; 
                    if (!(payload.from in this.UTXO_balances)) {
                        this.UTXO_balances[payload.from] = 0;
                    }
                    if (!(payload.to in this.UTXO_balances)) {
                        this.UTXO_balances[payload.to] = 0;
                    }
                    if(this.UTXO_balances[payload.from] >= payload.amount){
                        this.UTXO_balances[payload.from] -= payload.amount ;
                        this.UTXO_balances[payload.to] += payload.amount ; 
                        if (!(payload.from in UTXO_tmp_balances)) {
                            UTXO_tmp_balances[payload.from] = 0;
                        }
                        if (!(payload.to in UTXO_tmp_balances)) {
                            UTXO_tmp_balances[payload.to] = 0;
                        }
                        UTXO_tmp_balances[payload.from] += payload.amount ; 
                        UTXO_tmp_balances[payload.to] -= payload.amount ;

                    }else{
                        for(const account in UTXO_tmp_balances){
                            this.UTXO_balances[account] += UTXO_tmp_balances[account] ;
                        }
                        return false;
                    }
                }
                if (!(newBlock.minerpk in this.UTXO_balances)) {
                    this.UTXO_balances[newBlock.minerpk] = 0;
                }
                this.UTXO_balances[newBlock.minerpk] += this.reward ; 
                this.chain.push(newBlock);
                console.log("Block added ✓") ; 
                this.eventBlockChain.emit("blockAdded" ,newBlock) ;
                return true;
            }
        }
        return false
    }

    
    validTransactionsInBlock(block){
        const transactions = block.data;
        for (key in transactions){
            
        }
    }
}

const blockchain = new Blockchain(10,3);

module.exports = blockchain;
