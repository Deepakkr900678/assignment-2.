const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/assignment");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const postsRoutes = require("./routes/posts");
const secret = "RESTAPIAUTH";
var jwt = require('jsonwebtoken');
const bodyparser = require("body-parser");

const app = express();
app.use(bodyparser.json());

app.use('/api/v1/posts', (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization?.split("Bearer ")[1];
        if(token){
            // verify a token symmetric
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    return res.status(403).json({
                        status: "failed",
                        message: "Not a valid token"
                    })
                }
                req.user =  decoded.data// bar
                console.log(req.body);
                next();
            });
        }else {
            return res.status(401).json({
                status: "Failed",
                message: "Toeken is missing"
            })
        }
    }else {
        return res.status(403).json({
            status: "Failed",
            message: "Not authenticated user"
        })
    }

})  
  

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/users", loginRoutes);
app.use("/api/v1", postsRoutes);

app.get("*", (req, res) => {
    res.status(404).send("API NOT FOUND");
});

app.listen(3000, () => console.log("The server is up at port 3000"));

