const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

const userSchema = {
    validate(body) {
        if (!body) {
            return { error: { details: [{ message: "Request body is missing" }] } };
        }
        if (body.email === undefined || typeof body.email !== "string" || !body.email.includes("@")) {
            return { error: { details: [{ message: "Please provide a valid email" }] } };
        }
        if (body.password === undefined || typeof body.password !== "string" || body.password.length < 6) {
            return { error: { details: [{ message: "Password must be at least 6 characters long" }] } };
        }
        if (body.name !== undefined && (typeof body.name !== "string" || body.name.trim().length === 0)) {
            return { error: { details: [{ message: "Name must be a valid string" }] } };
        }
        return { error: null };
    }
};

User.userSchema = userSchema;

module.exports = User;