const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/configs/db");
const authRoutes = require("./src/routes/authRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const savedRoutes = require("./src/routes/savedRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", itemRoutes);
app.use("/api", savedRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});