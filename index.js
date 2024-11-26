const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./src/routes/taskRoutes");
require("dotenv").config();
//middleware
const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
app.get('/', async (req, res)=>{
   try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState; // Connection state (1 = connected)
        res.send("Connected to MongoDB");
         res.end();
    } catch (error) {
        res.send("MongoDB connection failed:", error.message);
        throw error; // Ensure errors are logged
       res.end();
    }
})
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
