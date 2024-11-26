const connectDB = require("./src/config/db")
const {walletSP_APP} = require("./src/walletSP")







const PORT = process.env.PORT_WALLET_SP || 8975;



connectDB().then(() => {
    console.log("database connected !")
    walletSP_APP.listen(PORT, () => {
        console.log(`Wallet Service Provider is Running on port : ${PORT}`)
    })
}).catch(()=>{
    console.error("error DataBase") ; 
})
 