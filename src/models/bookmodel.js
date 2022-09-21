const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;


const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: [String],
        required: true
    },
    reviews: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        defult: null
    },
    isDeleted: {
        type: boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Book', BookSchema)