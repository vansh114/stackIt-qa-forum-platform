const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 150,
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
        author: {
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
    },
    {
        timestamps: true,
    }
);

questionSchema.index({ tags: 1 });
questionSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Question', questionSchema);