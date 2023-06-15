const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "rohit";
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var fetchuser = require("../middleware/fetchuser")



// Route 1: creating user using : POST "/api/createuser", no login required



router.post("/createuser", [
    body('name', 'enter valid name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    try {

        // if there are errors return bad request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() })
        }

        // check whether user with this email exists

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "email already exist" })
        }


        // hashing of password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.log(error)
        res.status(500).json("error")
    }
});








// Route 2: creating user using : POST "/api/createuser", no login required

router.post("/login", [
    body('email').isEmail(),
    body('password', "password cannot be blank").exists(),
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "incorrect credentials" })
        }
        const passcompare = await bcrypt.compare(password, user.password);
        if (!passcompare) {
            success = false;
            return res.status(400).json({ success, error: "incorrect credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("internal server error")
    }
});


// Route 3 : get logined user details using post: /api/auth/getuser # login required

router.post("/getuser", fetchuser, async (req, res) => {
    try {
        userid = req.user.id
        res.send(userid)
        const user = await User.findById(userid)

    } catch (error) {
        console.error(error.message)
        res.status(500).json("internal server error");
    }
});
module.exports = router;