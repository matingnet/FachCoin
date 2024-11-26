const { httpServer } = require("./src/socket/transactionSocket");
require("dotenv").config();

const PORT = process.env.PORT_MEMPOOL;

httpServer.listen(PORT, () => {
    console.log(`MemPool Service is Running on port: ${PORT}`);
}).on('error', (err) => {
    console.error(`Failed to start server: ${err.message}`);
});
