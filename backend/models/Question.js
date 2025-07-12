const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
        },
        description: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
        askedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        answers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Answer',
            },
        ],
        acceptedAnswer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Question', questionSchema);