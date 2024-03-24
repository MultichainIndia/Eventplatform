const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./src/routes/authRoute");

app.use(cors());
app.use(express.json());
app.use("/", authRoute);

mongoose
  .connect("mongodb://localhost:27017/event-platform")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
