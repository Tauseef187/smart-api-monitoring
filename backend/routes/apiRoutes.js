const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    createApi,
    getMyApis,
    getApiById,
    updateApi,
    deleteApi
} = require("../controllers/apiController");

// /api/apis
router.post("/",        protect, createApi);   // CREATE
router.get("/",         protect, getMyApis);   // GET ALL

// /api/apis/:id
router.get("/:id",      protect, getApiById);  // GET ONE
router.put("/:id",      protect, updateApi);   // EDIT
router.delete("/:id",   protect, deleteApi);   // DELETE

module.exports = router;