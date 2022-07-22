import express from "express" //npm start start:dev - запускает отслеживание index.js в реальном времени
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import {registerValidation} from "./validations/auth.js";
import {validationResult} from 'express-validator'
import UserSchema from "./models/User.js";
import bcrypt from "bcrypt";

mongoose.connect('mongodb+srv://admin:www1234@cluster0.jjpbqks.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log("DB connection error", err)
    })

const app = express()
app.use(express.json()) // позволяет читать приходящие json данные

app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const doc = new UserSchema({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash,
    })
    const user = await doc.save()

    res.json(user)
})


app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log("server is up")
})