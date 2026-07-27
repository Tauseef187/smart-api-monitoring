const express=require("express");

const router=express.Router();

const protect=require("../middleware/authMiddleware");

const {

getHistory

}=require("../controllers/historyController");

router.get("/:apiId",protect,getHistory);

module.exports=router;