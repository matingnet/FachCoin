const fs = require("fs");
const Queue = require("./utils/queue");
require("dotenv").config();
const ioClient = require("socket.io-client");
const blockchain = require("./../modules/blockchain")
const path = require("path");
const Block = require("./../modules/block")



const Global_URI = process.env.GLOBAL_URI;
blockchain.eventBlockChain.on("blockAdded" , broadcastBlock);
const listOfPrimaryNodes = new Set(loadNodes()); // URLs
const listOfClients = new Set(); // Client sockets
const listOfServers = new Set(); // Server sockets
const listOfClientsURIs = new Set(); // URIs of clients
const listOfServersURIs = new Set(); // URIs of servers
const diffusedURIs = new Set();
const listOfServices = new Set() ; 



const queueNodes = new Queue();
queueNodes.enqueue([...listOfPrimaryNodes]);
let ioServer = null;


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


// Load nodes from JSON file
function loadNodes() {
    const nodesPath = path.join(__dirname, ".." , ".." , "nodes.json");
    const nodesData = fs.readFileSync(nodesPath, "utf-8");
    return JSON.parse(nodesData).nodes;
}

// Connect to nodes in the queue
function connectToNodes() {
    while (!queueNodes.isEmpty()) {
        const currentNode = queueNodes.dequeue();

        if (listOfServersURIs.has(currentNode)) {
            continue; // Skip if already connected
        }

        const peerSocket = connectToNode(ioClient, currentNode);
        if (peerSocket) {
            peerSocket.emit("shareAllNodes", Array.from(listOfServersURIs));
        }
    }
}

// Connect to a single node
function connectToNode(ioClient, URI) {
    if(URI === Global_URI){
        return null;
    }
    if (listOfServersURIs.has(URI)) {
        return null;
    }
    const peerSocket = ioClient(URI);
    peerSocket.uri = URI;
    
    peerSocket.on("connect", () => {
        
        listOfServers.add(peerSocket);
        listOfServersURIs.add(URI);
        peerSocket.emit("connect_back", Global_URI);
    });

    peerSocket.on("allNodes", (nodes) => {
        nodes.forEach(node => {
            if (!listOfServersURIs.has(node)) {
                queueNodes.enqueue(node);
            }
        });
        connectToNodes(); // Recursively connect to new nodes
    });

    peerSocket.on("connect_error", (err) => {
    });

    return peerSocket;
}

// Handle incoming connections on the server
function handleServer(io) {
    ioServer = io;
    ioServer.on("connection", (socket) => {
        listOfClients.add(socket);

        socket.on("iAmService",()=>{
            listOfClients.delete(socket) ; 
            listOfServices.add(socket) ;
        })

        socket.on("nodeAdded",(uri)=>{
            queueNodes.enqueue(uri);
            connectToNodes();
        })
        socket.on("connect_back", (uri) => {
            if (!(diffusedURIs.has(uri))) {
                diffusedURIs.add(uri);
                Array.from(listOfServers).forEach(socket => {
                    socket.emit("nodeAdded" , uri) ;
                });
            }
            socket.uri = uri;
            listOfClientsURIs.add(uri);

            queueNodes.enqueue(uri);
            connectToNodes();
        });

        socket.on("shareAllNodes", (nodes) => {
            Array.from(nodes).forEach(node => {
                if (!listOfServersURIs.has(node)) {
                    queueNodes.enqueue(node);
                }
            });

            connectToNodes(); // Recursively connect to new nodes
            socket.emit("allNodes", Array.from(listOfServersURIs));
        });

        socket.on("disconnect", () => {
            listOfClients.delete(socket);
            listOfClientsURIs.delete(socket.uri);
        });

        socket.on("blockAdded", (block)=>{
            const newblock = convertToBlockInstance(block)
            blockchain.addBlock(newblock) ; 
        })
    });
}


function broadcastBlock(block){
    Array.from(listOfServers).forEach(socket => {
        socket.emit("blockAdded" , block) ;
    });
    Array.from(listOfServices).forEach(socket => {
        socket.emit("blockAdded" , block) ;
    });
}

module.exports = { connectToNodes, connectToNode, loadNodes, handleServer };
