const Tag = require('../models/Tag');
const { validationResult } = require('express-validator');

// ================================
// POST /api/tags – Create a tag
// ================================
exports.createTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

    const { name } = req.body;

    try {
        const existing = await Tag.findOne({ name: name.toLowerCase() });
        if (existing)
            return res.status(400).json({ success: false, error: 'Tag already exists' });

        const tag = new Tag({ name: name.toLowerCase() });
        await tag.save();

        res.status(201).json({ success: true, tag });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.suggestTags = async (req, res) => {
    const query = req.query.q || '';
    try {
        const suggestions = await Tag.find({
            name: { $regex: query, $options: 'i' },
        }).limit(10);

        res.json({ success: true, tags: suggestions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ name: 1 });
        res.json({ success: true, tags });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};