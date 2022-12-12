const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
mongoose.connect("mongodb://localhost/assignment");
const bodyparser = require("body-parser");

const router = express.Router();

router.use(bodyparser.json());

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: "Success",
            users: users
        })
    } catch (e) {
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});
router.get("/:id", async (req, res) => {
    try {
        const users = await User.find({ _id: req.params.id });
        res.json({
            status: "Success",
            users: users
        })
    } catch (e) {
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});


router.post("/", async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json({
            status: "Success",
            user
        })
    } catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.put("//:email", async (req, res) => {
    try{
        const user = await User.updateMany({email : req.params.email}, {$set : {name: req.body.name}});
        res.json({
            status: "Success",
            user
        })
    }catch(e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.put("/:id", async (req, res) => {
    try {
        const user = await User.updateOne({ _id: req.params.id }, req.body);
        res.json({
            status: "Success",
            user
        })
    } catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.params.id });
        res.json({
            status: "Success",
            user
        })
    } catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

module.exports = router;