const {server} = require("./src/network/network")
require("dotenv").config() ; 

const PORT = process.env.PORT;


server.listen(PORT, () => {
    console.log(`The blockchain server is running on port ${PORT}`);
});



