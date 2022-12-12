const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
mongoose.connect("mongodb://localhost/assignment");
const bodyparser = require("body-parser");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = "RESTAPIAUTH";

const router = express.Router();

router.use(bodyparser.json());

router.post("/register",
    body('email').isEmail(),
    body('name').isAlpha(),
    body('password').isLength({ min: 6, max: 16 }), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, password } = req.body;
            let user = await User.findOne({ email });
            if (user) {
                return res.status(409).json({
                    status: "Failed",
                    message: "User already exists with the given email"
                })
            }
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }

                user = await User.create({
                    name: name,
                    email: email,
                    password: hash
                });

                res.json({
                    status: "Success",
                    message: "User succesfully created",
                    user
                })
            });

        } catch (e) {
            res.json({
                status: "Failed",
                message: e.message
            })
        }
    });

router.post("/login",
    body('email').isEmail(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(409).json({
                    status: "Failed",
                    message: "There is no account with the entered email"
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                    }, secret);


                    return res.json({
                        status: "Success",
                        message: "Login Succesful",
                        token
                    })
                } else {
                    return res.status(401).json({
                        status: "Failed",
                        message: "Invalid credentials"
                    })
                }

            });

        } catch (e) {
            res.json({
                status: "Failed",
                message: e.message
            })
        }
    });

module.exports = router;