import express from "express" //npm start start:dev - запускает отслеживание index.js в реальном времени
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import {validationResult} from 'express-validator'
import UserSchema from "./models/User.js";
import bcrypt from "bcrypt";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import {loginValidation, postCreateValidation, registerValidation} from "./validations.js";
import {remove} from "./controllers/PostController.js";


mongoose.connect('mongodb+srv://admin:www1234@cluster0.jjpbqks.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log("DB connection error", err)
    })

const app = express()
app.use(express.json()) // позволяет читать приходящие json данные

app.post('/auth/register', registerValidation, UserController.register )
app.post('/login', loginValidation, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id',  PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log("server is up")
})