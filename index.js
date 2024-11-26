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

//test database
let isConnected = 0; // Track the connection state

const connectToDatabase = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState; // Connection state (1 = connected)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error; // Ensure errors are logged
    }
};



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
        console.error("Error in API handler:", error); // Log the full error
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
