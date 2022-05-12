const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/user');
const bcrypt = require('bcrypt');
const e = require('express');

app.set("view engine","pug");
app.set("views","views");

app.use(bodyParser.urlencoded({extended: false}));

router.get("/",(req,res,next)=>{  
    if(req.session && req.session.user){
        res.redirect("/");
    }else{
        res.status(200).render("login");
    }
})

router.post("/",async (req,res,next)=>{    
    
    var payload = req.body;
    if(req.body.username && req.body.password){
        var user = await User.findOne({
            $or: [
                {username: req.body.username},
                {email: req.body.email}
            ]// it will check if any one of these exist.
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage = "Something went wrong";
            res.status(200).render("login",payload);
        });

        if(user != null){
            var result = await bcrypt.compare(req.body.password, user.password);
            if(result === true){
                req.session.user = user;
                return res.redirect('/');
            }
        }    
            payload.errorMessage = "Login creds incorrect";
            return res.status(200).render("login",payload);
    }
        payload.errorMessage = "Make sure each field has valid value";
        res.status(200).render("login",payload);
    
})


module.exports = router;