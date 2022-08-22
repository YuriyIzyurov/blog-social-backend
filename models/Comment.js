import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
        text: {
            type: String,
            required: true,
        },
        likesCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //так делается связь между 2 таблицами
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Comment', CommentSchema)