const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./src/routes/taskRoutes");

//middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

mongoose
  .connect(
    "mongodb+srv://officePc:Ewsl7PZcOLC4zFyT@cluster0.wn4j5.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const PORT = 5000;

app.get('/', (req, res)=>{
  res.send('App is working');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
