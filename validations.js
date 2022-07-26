import {body} from 'express-validator'

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 4}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL(),
]
export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 4})
]
export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isObject(),
]
export const commentCreateValidation = [
    body('text', 'Комментарий должен быть больше 1 символа').isLength({min: 2}).isString()
]