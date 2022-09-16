
import express from "express"
import mongoose from "mongoose";
import {commentCreateValidation, loginValidation, postCreateValidation, registerValidation} from "./validations.js";
import multer from "multer"
import {UserController, PostController, CommentController} from './controllers/index.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import cors from 'cors'



mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log("DB connection error", err)
    })

const app = express()
app.use(express.json()) // позволяет читать приходящие json данные

const storage = multer.diskStorage({
    destination: (_,__, callback) => {
        callback(null, 'uploads')
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname)
    },
})

const upload = multer({storage})


app.use('/uploads', express.static('uploads')) //при получении get запроса на uploads проверяет наличие файла в локальных папках
app.use(cors()) //отключить политику корс при запросе с локалхоста на локалхост

//Auth endpoint
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register )
app.post('/login', loginValidation, handleValidationErrors,  UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/user/avatar', checkAuth, upload.single('avatar'), UserController.addAvatar)
app.post('/upload', checkAuth, upload.single('preview'), (req, res) => {
    res.json({
        resultCode:0,
        data: {url:`/uploads/${req.file.originalname}`}
    })
})

//Posts endpoint
app.get('/posts', PostController.getAll)
app.get('/author/:userId', PostController.getAllPostsByAuthor)
app.get('/top',  PostController.getTopPosts)
app.get('/myPosts', checkAuth, PostController.getMyPosts)
app.get('/views', PostController.getTopViewed)
app.get('/posts/:id',  PostController.getOne)
app.get('/tags',  PostController.getLastTags)
app.get('/tags/:tag',  PostController.getTagMatch)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

//Comments endpoint
app.get('/comments', CommentController.getAll)
app.get('/comments/:id', CommentController.getAllCommentsOfPost)
app.post('/comments/:id', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create)
app.delete('/comments/:id', checkAuth, CommentController.remove)
app.patch('/comments/:id', checkAuth,  CommentController.update)

app.listen( process.env.PORT || 4444, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log("server is up")

})