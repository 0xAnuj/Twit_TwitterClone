const express = require('express');
const app = express();
const port = 2000;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

app.set("view engine","pug");
app.set("views","views");
app.use(session({
    secret: "fuck world",
    resave: true,
    saveUninitialized: false
}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"public")));
//Routes
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoutes = require('./routes/logout');
const postRoute = require('./routes/postRoutes');

//Api Routes
const postApiRoute = require('./routes/api/posts');

app.use("/login",loginRoutes);
app.use("/register",registerRoutes);
app.use("/logout",logoutRoutes);
app.use("/api/posts",postApiRoute);
app.use("/posts",postRoute);


app.get("/", middleware.requirelogin,(req,res,next)=>{
    
    var paylaod = {
        pageTitle: "Home",
        userInfo: req.session.user,
        userInfoJs: JSON.stringify(req.session.user)
    }

    res.status(200).render("home",paylaod);
})

const server = app.listen(port,() =>{
    console.log('listening on port : '+ port);
});