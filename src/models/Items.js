const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

ItemSchema.index({ category: 1 });

const Item = mongoose.model("Item", ItemSchema);

const itemSchema = {
    validate(body) {
        if (!body) {
            return { error: { details: [{ message: "Request body is missing" }] } };
        }
        if (body.title === undefined || typeof body.title !== "string" || body.title.trim() === "") {
            return { error: { details: [{ message: "Title is required and must be a string" }] } };
        }
        if (body.description === undefined || typeof body.description !== "string" || body.description.trim() === "") {
            return { error: { details: [{ message: "Description is required and must be a string" }] } };
        }
        if (body.category === undefined || typeof body.category !== "string" || body.category.trim() === "") {
            return { error: { details: [{ message: "Category is required and must be a string" }] } };
        }
        if (body.image === undefined || typeof body.image !== "string" || body.image.trim() === "") {
            return { error: { details: [{ message: "Image is required and must be a string" }] } };
        }
        if (body.price === undefined || typeof body.price !== "number" || body.price <= 0) {
            return { error: { details: [{ message: "Price is required and must be a positive number" }] } };
        }
        return { error: null };
    }
};

Item.itemSchema = itemSchema;

module.exports = Item;

