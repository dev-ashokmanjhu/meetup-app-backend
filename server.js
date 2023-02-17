const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 4000;
// middlewares
app.use(bodyParser.json());
app.use(cors());

// database configeretion
mongoose.set("strictQuery", true);
const db = mongoose
  .connect(
    "mongodb+srv://ashokmanjhu:ashokmanjhu@cluster0.m8gxypg.mongodb.net/meetups?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("mongodb connected successfully!!!");
  })
  .catch((err) => {
    console.log(err);
  });
// schema
const userSchema = new mongoose.Schema({
  title: String,
  image: String,
  address: String,
  description: String,
});
// Modals
const User = mongoose.model("User", userSchema);

// root route
app.get("/", (req, res) => {
  res.json("Server is Running Successfully!!!");
});

// getting all data
app.get("/api/data", (req, res) => {
  User.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      // handle the error
      res.json("error");
    });
});

// api for adding meetups
app.post("/api/submit", (req, res) => {
  const user = new User({
    title: req.body.enteredTitle,
    image: req.body.enteredImage,
    address: req.body.enteredAddress,
    description: req.body.enteredDescription,
  });
  user.save((err, user) => {
    if (err) {
      console.log(err);
      res.send({ error: "Error inserting data into the database" });
      return;
    }
    console.log("Data inserted into the database");
    res.send({ message: "Data inserted into the database" });
  });
});

// api for particular meetup
app.get("/api/data/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((meetup) => {
      if (meetup) {
        res.json(meetup);
      } else {
        res.status(404).json({ message: "meetup not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving meetup" });
    });
});

app.listen(port, () => {
  console.log("App is running successfully!!!");
});
