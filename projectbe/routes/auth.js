const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator")
const User = require('../models/user');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const jwt_secretkey = "jai jai shree ram"

router.post('/signup',
    [
        body('name', 'name must have 3 charecter length').isLength({ min: 3 }),
        body('email', "enter valid email").isEmail(),
        body('password', "password must have 5 chrecters").isLength({ min: 5 })
    ],
    async (req, res) => {

        try {

            const { name, email, password } = req.body;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(404).json({ error: errors.array() });
            }

            let user = await User.findOne({ email: email })
            if (user) {
                return res.status(404).json({ error: "account is already created by this email" })
            }

            const salt = await bcrypt.genSalt(10);
            const hashpassword = bcrypt.hashSync(password, salt)

            user = await User.create({
                name: name,
                email: email,
                password: hashpassword
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            const token = jwt.sign(data, jwt_secretkey)
            console.log(token)
            res.status(200).json(token)

        }
        catch (error) {
            res.status(404).json(error)
        }

    })

router.post('/login', [
    body("email", "enter valid email").isEmail(),
    body("password", "enter min. 5 charecter password").isLength({ min: 5 })
],
    async (req, res) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ error: errors.array() })
            }

            let user = await User.findOne({ email: req.body.email })

            if (!user) {
                return res.status(404).json({ error: "please first create your account" })
            }

            const comparepass =await bcrypt.compare(req.body.password, user.password)

            if (!comparepass) {
                return res.status(404).json({ error: 'wrong password' })
            }

            const data = {
                user: {
                    id: user.id
                }
            }

            const token = jwt.sign(data, jwt_secretkey)

            res.status(200).json(token)

        }
        catch (err) {
            res.status(404).json(err);
        }

    })


module.exports = router