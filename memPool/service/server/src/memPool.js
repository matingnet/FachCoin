const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const memPoolRoute = require("./routes/memPoolRoute");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors

const memPool_APP = express();
require("dotenv").config();

// CORS configuration
const corsOptions = {
    origin: "*", // Allow all origins, adjust for production
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Use CORS middleware
memPool_APP.use(cors(corsOptions));
memPool_APP.use(bodyParser.json({ limit: '1mb' }));
memPool_APP.use(express.static("./src/public"));
memPool_APP.use("/mempool/api/v1", memPoolRoute);


const httpServer = createServer(memPool_APP);
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

module.exports = { httpServer, io };
