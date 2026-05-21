const express = require('express');
const router = express.Router();
const {saveItem, getAllSavedItems, deleteSavedItem} = require('../controllers/savedController');
const protectRoute = require('../middleware/authMiddleware');

router.post('/items/:id/save', protectRoute, saveItem);
router.get('/me/saved', protectRoute, getAllSavedItems);
router.delete('/items/:id/save', protectRoute, deleteSavedItem);

module.exports = router;