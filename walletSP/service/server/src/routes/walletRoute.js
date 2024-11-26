const express = require("express") ; 
const router = express.Router() ; 
const {createWallet , affectTransaction,walletLogin , verifyLogin} = require("../controllers/walletControllers")
const {verifyWallet} = require("../middlewares/verifyWallet")


router.post("/login" , walletLogin) ;

router.post("/createwallet" , createWallet ) ; 

router.post("/affectTransaction", verifyWallet , affectTransaction) ; 

router.post("/verifyLogin" ,verifyLogin ) ; 


module.exports = router ; 