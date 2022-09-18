import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
            type: Number,
            default: 0,
        },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //так делается связь между 2 таблицами
        required: true,
    },
    imageUrl: {
        large: String,
        small: String,
    },
},
    {
        timestamps: true,
    }
    )

export default mongoose.model('Post', PostSchema)