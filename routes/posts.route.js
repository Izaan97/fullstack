let uniqid = require('uniqid');
let Post = require('../models/post.model').Post;
let express = require('express');
let router = express.Router();
let authMiddlware = require('../middleware/auth');

const multer = require("multer");
const uploadFolder = multer({ dest: "./public/images/uploads/" });

router.get('/', async (req, resp) => {
    let posts = await Post.find();
    resp.send(posts);
})

router.get('/:id', async (req, resp) => {
    let id = req.params.id;
    let post = await Post.findOne({ id: id });
    resp.send(post);
})

router.post('/', uploadFolder.single("imageFile"), async (req, res) => {

    const { body, file } = req

    const newPost = new Post({
        id: uniqid(),
        title: body.title,
        date: new Date(),
        description: body.description,
        text: body.text,
        country: body.country,
        imageURL: file ? file.path.replace("public", "") : body["imageURL"]
    })

    await newPost.save();

    res.send('Created');
})

router.delete('/:id', authMiddlware, async (req, resp) => {
    let id = req.params.id;
    await Post.deleteOne({ id: id });
    resp.send('Deleted');

})

router.put('/:id', authMiddlware, async (req, resp) => {
    let id = req.params.id;
    await Post.updateOne({ id: id }, req.body);
    resp.send('Updated');
})

module.exports = router;