const express = require("express") ; 
const router = express.Router() ; 
const {addTransaction, getAllTransactions} = require("../controllers/memPoolControllers")



router.post("/addtransaction" , addTransaction) ;


router.post("/getalltransactions", getAllTransactions) ; 


module.exports = router ; 