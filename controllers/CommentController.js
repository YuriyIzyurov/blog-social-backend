import CommentSchema from "../models/Comment.js";
import PostSchema from "../models/Post.js";


export const create = async (req, res) => {
    try {
        const postId = req.params.id
        const doc = new CommentSchema({
            text: req.body.text,
            user: req.userID,
            post: postId
        })

        const comment = await doc.save()
        //Add +1 to post comment counter
        await PostSchema.findByIdAndUpdate(postId,
            {
                $inc: { commentsCount: 1}
            }
        ).clone()

        res.json({
            resultCode: 0,
            data: comment
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать комментарий"
        })
    }
}

export const getAllCommentsOfPost = async (req, res) => {
    try {
        let comments = await CommentSchema.find({post: req.params.id}).populate('user').exec()
        res.json(comments)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить комментарии"
        })
    }
}
export const getAll = async (req, res) => {
    try {
        let comments = await CommentSchema.find().populate('user').exec()
        res.json(comments.slice(-5).reverse())

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить комментарии"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const commentId = req.params.id
        await CommentSchema.findOneAndDelete(
            {
                _id: commentId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        message: "Не удалось удалить комментарий"
                    })
                }
                if (!doc) {
                    return res.json({
                        resultCode:1,
                        message: " Комментарий не найден"
                    })
                }
                res.json({
                    resultCode:0,
                    message: "success"
                })
            }
        ).clone()

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить комментарий"
        })
    }
}
export const update = async (req, res) => {
    try {
        const commentId = req.params.id
        await CommentSchema.updateOne(
            {
                _id: commentId,
            },
            {
                text: req.body.text
            }
        )
        res.json({
            resultCode:0,
            message: "success"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить комментарий"
        })
    }
}

/*
export const getOne = async (req, res) => {

    try {
        const postId = req.params.id
        await PostSchema.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1},
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Не удалось загрузить пост"
                    })
                }
                if (!doc) {
                    return res.status(500).json({
                        message: " Статья не найдена"
                    })
                }
                res.json(doc)
            }
        ).clone().populate('user').exec()
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить пост"
        })
    }
}
export const getLastTags = async (req, res) => {
    try {
        const posts = await PostSchema.find().limit(5).exec()
        const tags = posts.map(item => item.tags).flat().slice(0,5)
        res.json(tags)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить посты"
        })
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        await PostSchema.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        message: "Не удалось удалить статью"
                    })
                }
                if (!doc) {
                    return res.json({
                        resultCode:1,
                        message: " Статья не найдена"
                    })
                }
                res.json({
                    resultCode:0,
                    message: "success"
                })
            }
        ).clone()

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить пост"
        })
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostSchema.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userID,
            }
        )
        res.json({
            resultCode:0,
            message: "success",
            _id: postId
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить пост"
        })
    }
}*/
