import bcrypt from "bcrypt";
import UserSchema from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from 'fs'

export const register = async (req, res) => {
    try {
        console.log(req.body)
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const doc = new UserSchema({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id,
            },
            'secret12345',
            {
                expiresIn: '30d',
            })

        const {passwordHash, ...userData } = user._doc

        res.json({
            resultCode:0,
            data:{...userData, token}
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserSchema.findOne({email: req.body.email})
        if(!user) {
            return res.json({
                resultCode:1,
                message: "Неверный логин или пароль"
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if(!isValidPass) {
            return res.json({
                resultCode:1,
                message: "Неверный логин или пароль"
            })
        }
        const token = jwt.sign({
                _id: user._id,
            },
            'secret12345',
            {
                expiresIn: '30d',
            })
        const {passwordHash, ...userData } = user._doc

        res.json({
            resultCode:0,
            data:{...userData, token}
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось авторизироваться"``
        })
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userID)
        if(!user) {
            return res.status(404).json({message: "Пользователь не найден"})
        }
        const {passwordHash, ...userData } = user._doc
        res.json({
            resultCode: 0,
            data: userData,
        })
    } catch (err) {
        console.log(err)
        res.json({
            resultCode:1,
            data:{message: "Не удалось авторизироваться"}
        })
    }
}
export const addAvatar = async (req, res) => {

    try {
        const {small, medium} = req.body.images[0]
        await UserSchema.updateOne({
            _id: req.userID
        }, {
            avatarUrl: {
                large:medium.path,
                small:small.path
            }
        })
        res.json({
            resultCode: 0,
            data: {
                messages: ['Фото успешно загружено'],
                avatarUrl: {
                    large:medium.path,
                    small:small.path
                }
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            resultCode: 1,
            data:{messages: ['Не удалось загрузить фото']}
        })
    }
}
export const uploadFile = (req, res) => {
    try {
        res.json({
            resultCode:0,
            data: req.body.images[0]
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            resultCode: 1,
            data:{messages: ['Не удалось загрузить фото']}
        })
    }
}
export const deleteFile = (req, res) => {
    try {
        const originalId = req.params.id
        const mediumId = originalId.replace('original','medium')
        const smallId = originalId.replace('original','small')

        const originalFile = `./uploads/original/${originalId}`
        const mediumFile = `./uploads/medium/${mediumId}`
        const smallFile = `./uploads/small/${smallId}`

        const errorHandler = (err) => {
            if (err) {
                console.error(err)
            }
        }

        fs.unlink(originalFile, errorHandler)
        fs.unlink(mediumFile, errorHandler)
        fs.unlink(smallFile, errorHandler)

        res.json({
            resultCode:0,
            data: {messages: ['Успешно удалено']}
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            resultCode: 1,
            data:{messages: ['Не удалось удалить изображение']}
        })
    }
}