const Item = require("../models/items");

// Post New Item
exports.createItem = async (req, res) => {
    try {
        const { title, description, category, image, price } = req.body;

        if (!title || !description || !category || !image || !price) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const newItem = new Item({ title, description, category, image, price });
        await newItem.save();
        res.status(201).json({ item: newItem });
    } catch (error) {
        console.log("Error in creating item", error.message);
        res.status(500).json({ message: error.message });
    }
};
// Get All Items
exports.getAllItems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        const items = await Item.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!items) {
            return res.status(404).json({ message: "Items not found" });
        }

        res.status(200).json({ items });
    } catch (error) {
        console.log("Error in getting items", error.message);
        res.status(500).json({ message: error.message });
    }
};
// Get Item By Id
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ item });
    } catch (error) {
        console.log("Error in getting item", error.message);
        res.status(500).json({ message: error.message });
    }
};
// Delete Item
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.log("Error in deleting item", error.message);
        res.status(500).json({ message: error.message });
    }
};
