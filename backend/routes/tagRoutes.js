const express = require('express');
const { body } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const {
    createTag,
    suggestTags,
    getAllTags
} = require('../controllers/tagController');

const router = express.Router();

router.post(
    '/',
    fetchUser,
    [body('name', 'Tag name is required').isLength({ min: 1 })],
    createTag
);

router.get('/suggest', suggestTags);

router.get('/', getAllTags);

module.exports = router;