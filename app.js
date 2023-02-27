let express = require('express');
let app = express();
let mongoose = require('mongoose');
let multer = require('multer');
let cookieParser = require('cookie-parser');
let postsRouter = require('./routes/posts.route');
let callbackRequestsRouter = require('./routes/callback-requests.routes');
let emailsRouter = require('./routes/emails.route');
let usersRouter = require('./routes/users.route');
let Post = require('./models/post.model').Post;
let auth = require('./controllers/auth');


app.set('view engine', 'ejs');


mongoose.connect('mongodb+srv://izaan:sora--1234@cluster0.wapaq7d.mongodb.net/travels');
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use('/posts', postsRouter);
app.use('/callback-requests', callbackRequestsRouter);
app.use('/emails', emailsRouter);
app.use('/users', usersRouter);

app.get('/landmark', async (req, resp) => {
    let id = req.query.id;
    let post = await Post.findOne({ id: id });
    resp.render('landmark', {
        title: post.title,
        imageURL: post.imageURL,
        date: post.date,
        text: post.text
    })
})


app.get('/admin', (req, resp) => {
    let token = req.cookies['auth_token'];
    if (token && auth.checkToken(token)) {
        resp.render('admin');
    } else {
        resp.redirect('/login');
    }

})

app.get('/login', (req, resp) => {
    let token = req.cookies['auth_token'];
    if (token && auth.checkToken(token)) {
        resp.redirect('/admin');
    } else {
        resp.render('login');
    }
})

app.listen(3000, () => console.log('Listening 3000....'));
