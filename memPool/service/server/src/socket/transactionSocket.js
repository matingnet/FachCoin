const { httpServer, io } = require("./../memPool"); 
const { transactions, eventEmitter } = require("./../controllers/memPoolControllers");

const sockets_miners = new Set();

const informAddedTransaction = (transaction) => {
    for (const socket of sockets_miners) {
        socket.emit("transactionAdded", JSON.stringify(transaction)); // Ensure the event name matches
    }
};

const informRemovedTransaction = (transaction) => {
    for (const socket of sockets_miners) {
        socket.emit("transactionRemoved", transaction); // Ensure the event name matches
    }
};

eventEmitter.on("transactionadded", informAddedTransaction); // Match event name
eventEmitter.on("transactionremoved", informRemovedTransaction); // Match event name

io.on("connection", (socket) => {
    sockets_miners.add(socket);
    socket.emit("alltransactions", [...transactions]);

    socket.on("alltransactions", () => {
        socket.emit("alltransactions", [...transactions]);
    });

    socket.on("disconnect", () => {
        sockets_miners.delete(socket);
        console.log("Miner disconnected");
    });
});



module.exports = { httpServer, io } ; 