const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/post");
mongoose.connect("mongodb://localhost/assignment");
const bodyparser = require("body-parser");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = "RESTAPIAUTH";

const router = express.Router();

router.use(bodyparser.json());

router.use(bodyparser.urlencoded({ extended: false }))

router.post("/posts", async (req, res) => {
    console.log(req.body);
    try{
        const posts = await Post.create({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image,
            user: req.user
        })
        res.json({
            status: "Success",
            posts
        })

    }catch(e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.get("/posts", async (req, res) => {
    console.log(req.body);
    try{

        const {page = 1, pagesize =5} = req.query;

        const posts = await Post.find().skip((page-1) * pagesize).limit(pagesize);
        res.json({
            status: "Success",
            posts
        })

    }catch(e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

module.exports = router;