const BlockMiner = require("./modules/miner");
const axios = require("axios");

const minerPk = "04b68b9745d32ab9a1b84bda10095d53e1923c28ed71885f853311feaa0f8bb60ccab4c5fd992d7bcc5fbf33c78bb996f54162f4f1c3a61e2dc76017f78f2c725e";
const minerReward = 10; 
const index = 1;

async function getBlockchainMetadata() {
    try {
        const response = await axios.post('http://localhost:1022/blockchain/metadata');
        return response.data;
    } catch (error) {
        console.error("Error fetching previous hash:", error);
        throw error;
    }
}

async function getMempoolTransactions() {
    try {
        const response = await axios.post('http://localhost:1234/mempool/api/v1/getalltransactions');
        return response.data.map((transaction) => JSON.parse(transaction));
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}

async function main() { 
    const { latestHash: previousHash, difficulty } = await getBlockchainMetadata();
    const blockMiner = new BlockMiner(minerPk, minerReward, index, previousHash, Date.now());

    const transactions = await getMempoolTransactions();
    transactions.forEach(transaction => blockMiner.addTransaction(transaction));

    const minedBlock = blockMiner.mine(difficulty);

    await axios.post('http://localhost:1022/blockchain/addBlock', { block: minedBlock });
    console.log("Block added to the blockchain ✓");
}

main();
