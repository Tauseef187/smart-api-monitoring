const express=require("express");

const router=express.Router();

const protect=require("../middleware/authMiddleware");

const {

getAnalytics

}=require("../controllers/analyticsController");

 router.get("/:apiId",protect,getAnalytics);
// router.get("/:apiId", (req, res) => {
//     res.send("Analytics Route Works");
// });

module.exports=router;