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
        res.json({
            resultCode:0,
            data: comments
        })

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
        res.json({
            resultCode:0,
            data:comments.slice(-5).reverse()
            })

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
                    data:{message: "success"}
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
            data:{message: "success"}
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить комментарий"
        })
    }
}

