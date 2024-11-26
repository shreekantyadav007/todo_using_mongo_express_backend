const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./src/routes/taskRoutes");
require("dotenv").config();
//middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

let isConnected; 

async function connectToDatabase() {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

app.get('/', async (req, res) => {
    try {
        await connectToDatabase(); // Ensure MongoDB is connected
        if (req.method === "GET") {
            const tasks = await Task.find(); // Fetch tasks
            return res.status(200).json(tasks);
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error in API:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
