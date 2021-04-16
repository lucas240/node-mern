const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const WilderModel = require("./models/Wilder");
const WilderController = require("./controllers/Wilder");
const port = 5000;

// database
mongoose
  .connect("mongodb://127.0.0.1:27017/wilderdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

function runAsyncWrapper(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}

//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/wilder/read", runAsyncWrapper(WilderController.read));
app.post("/api/wilder/create", runAsyncWrapper(WilderController.create));
app.put("/api/wilder/update", runAsyncWrapper(WilderController.update));
app.delete("/api/wilder/delete", WilderController.delete);

app.get("*", (req, res) => {
  res.status(404);
  res.send({ success: false, message: "Wrong adress" });
});

app.use((error, req, res, next) => {
  if (error.name === "MongoError" && error.code === 11000) {
    res.status(400);
    res.json({ success: false, message: "The name is already used" });
  }

  console.log("Error status: ", error.status);
  console.log("Message: ", error.message);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
