const SavedItem = require('../models/SavedItem');
// post new saveItem
exports.saveItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user._id;
        const savedItem = new SavedItem({ user: userId, item: itemId });
        await savedItem.save();
        res.status(201).json({ savedItem });
    } catch (error) {
        console.log("Error in saving item", error.message);
        res.status(500).json({ message: error.message });
    }
};

// get all saved items
exports.getAllSavedItems = async (req, res) => {
    try {
        const savedItems = await SavedItem.find().populate("item");
        res.status(200).json({ savedItems });
    } catch (error) {
        console.log("Error in getting saved items", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Delete saveditem
exports.deleteSavedItem = async (req, res) => {
    try {
        const savedItem = await SavedItem.findOneAndDelete({ user: req.user._id, item: req.params.id });
        if (!savedItem) {
            return res.status(404).json({ message: "Saved item not found" });
        }
        res.status(200).json({ message: "Saved item deleted successfully" });
    } catch (error) {
        console.log("Error in deleting saved item", error.message);
        res.status(500).json({ message: error.message });
    }
};
