import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import WilderController from "./controllers/Wilder";

const app = express();
const port = 5000;

//Database
mongoose
  .connect("mongodb://127.0.0.1:27017/wilderdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

function runAsyncWrapper(callback: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    callback(req, res, next).catch(next);
  };
}

//Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/wilders", runAsyncWrapper(WilderController.read));
app.post("/api/wilders", runAsyncWrapper(WilderController.create));
app.put("/api/wilders", runAsyncWrapper(WilderController.update));
app.delete("/api/wilders", runAsyncWrapper(WilderController.delete));

app.get("*", (req, res) => {
  res.status(404);
  res.send({ success: false, message: "Wrong adress" });
});

interface CustomError extends Error {
  code: number;
  status: string;
}

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (error.name === "MongoError" && error.code === 11000) {
      res.status(400);
      res.json({ success: false, message: "The name is already used" });
    }

    console.log("Error status: ", error.status);
    console.log("Message: ", error.message);
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
