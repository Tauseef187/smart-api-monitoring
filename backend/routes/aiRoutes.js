const express        = require('express');
const router         = express.Router();
const { getAiInsights } = require('../controllers/aiController');
const protect        = require('../middleware/authMiddleware');

router.get('/insights/:apiId', protect, getAiInsights);

module.exports = router;