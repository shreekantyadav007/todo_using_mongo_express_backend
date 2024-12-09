const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Task = mongoose.model("Task", taskSchema);
const express = require("express");
const cors = require("cors");
require("dotenv").config();
//middleware
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', //'https://todo-using-mongo-express.onrender.com', 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization', 
}));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
app.use(cors());
app.use(express.json());
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/tasks/search", async(req, res)=>{
try {  
const { query } = req.body;
  if (!query) {
      return res.status(400).json({ error: "Query is required" });
  }
  const tasks = await Task.find({
                name: { $regex: query, $options: "i" }
            });

  return res.status(200).json(tasks);
} catch (error) {
            console.error("Error searching tasks:", error.message);
            return res.status(500).json({ error: error.message || "Internal server error" });
        }    
});
         
app.post("/api/tasks/status", async (req, res) => {
    try {
        const { taskId, status } = req.body;
        if (!taskId || status === undefined)
            return res.status(400).json({ error: "Task ID and status are required" });

        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
        if (!updatedTask) return res.status(404).json({ error: "Task not found" });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
         
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
