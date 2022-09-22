import PostSchema from "../models/Post.js";
import CommentSchema from "../models/Comment.js";



export const create = async (req, res) => {
    try {
        const doc = new PostSchema({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userID,
        })
        const post = await doc.save()
        res.json({
            resultCode: 0,
            data: post
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать пост"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const {page = 1, limit = 5, searchFilter, viewed = false} = req.query

        let sortParam
        if(viewed) {
             sortParam = {viewsCount: -1}
        } else sortParam = {_id: -1}

        const posts = await PostSchema.find()
            .sort(sortParam)
            .limit(limit)
            .or([
                {title: new RegExp(searchFilter, 'i')},
                {tags: new RegExp(searchFilter, 'i')},
            ])
            .skip((page-1)*limit)
            .populate('user')
            .exec()

        const totalCount = await PostSchema.find().or([
            {title: new RegExp(searchFilter, 'i')},
            {tags: new RegExp(searchFilter, 'i')},
        ]).countDocuments({}).exec()

        res.json({
            resultCode:0,
            data:{
                totalCount,
                posts
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить посты"
        })
    }
}

export const getOne = async (req, res) => {

    try {
       const post = await PostSchema.findByIdAndUpdate(req.params.id,
            {
                $inc: { viewsCount: 1},
            }).clone().populate('user').exec()

            res.json({
                resultCode:0,
                data: post
            })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить пост"
        })
    }
}
export const getAllPostsByAuthor = async (req, res) => {
    try {
       const post = await PostSchema.find({user:req.params.userId}).sort({viewsCount: -1}).populate('user').exec()

        res.json({
            resultCode:0,
            data: post
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить пост"
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostSchema.find().sort({viewsCount: -1}).limit(5).exec()
        const tags = posts.map(item => item.tags).flat()
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffle(tags)
        const lastTags = tags.slice(0,5)
        res.json({
            resultCode:0,
            data: lastTags
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить тэги"
        })
    }
}
export const getTopPosts = async (req, res) => {
    try {
        const topPosts = await PostSchema.find().sort({viewsCount: -1}).limit(6).exec()
        res.json({
            resultCode:0,
            data: {
                topPosts
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить топ посты"
        })
    }
}
export const getMyPosts = async (req, res) => {
    try {
        const myPosts = await PostSchema.find({user: req.userID}).sort({_id: -1}).populate('user').exec()
        res.json({
            resultCode:0,
            data: {
                totalCount:myPosts.length,
                myPosts,
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить ваши посты"
        })
    }
}
export const getTopViewed = async (req, res) => {
    try {
        const topPosts = await PostSchema.find().sort({viewsCount: -1}).populate('user').exec()
        //из полученного массива объектов редюсом собираем объект, в которм хранятся айди юзеров и сумма просмотров постов каждого юзера
        let posts = topPosts.reduce((obj, item) => {
          let key = item.user.fullName
            if(!obj.hasOwnProperty('top')){
                obj['top'] = []
            }
            if (!obj.hasOwnProperty(key)) {
                obj[key] = 0
                const person = {
                    id:item.user._id,
                    fullName:item.user.fullName,
                    avatarUrl:item.user.avatarUrl.small,
                    socialId:item.user.socialId,
                    viewsCount:0
                }
                obj['top'].push(person)
            }
            obj[key] = obj[key] + item.viewsCount
            obj['top'].forEach((elem) => {
                if(elem.fullName === key) {
                    elem.viewsCount = elem.viewsCount + item.viewsCount
                }
            })
            return obj
        },{})
        posts.top.sort((a,b) => b.viewsCount - a.viewsCount)
        res.json({
            resultCode:0,
            data: posts
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось загрузить данные"
        })
    }
}
export const getTagMatch = async (req, res) => {
    try {
        console.log(req.params.tag)
        const posts = await PostSchema.find({
            tags: { $all:[req.params.tag]}
        }).populate('user').exec()

        res.json({
            resultCode:0,
            data: posts
        })

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
                    data: {message: "success"}
                })
            }
        ).clone()
        await CommentSchema.deleteMany({post: postId})

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
            data:{
                message: "success",
                _id: postId
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить пост"
        })
    }
}