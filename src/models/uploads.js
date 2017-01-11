import mongoose from 'mongoose'

const Upload = new mongoose.Schema({
    type: {
        type: String,
        default: 'Upload',
    },
    path: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model('upload', Upload)
