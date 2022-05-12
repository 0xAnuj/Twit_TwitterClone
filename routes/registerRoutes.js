const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/user');
const { use } = require('./loginRoutes');
const bcrypt = require('bcrypt');

app.set("view engine","pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended: false}));

router.get("/",(req,res,next)=>{    
    if(req.session && req.session.user){
        res.redirect("/");
    }else{
        res.status(200).render("register");
    }
})

router.post("/",async (req,res,next)=>{    
     //console.log(req.body);
     var firstName = req.body.firstName.trim();
     var lastName = req.body.lastName.trim();
     var username = req.body.username.trim();
     var email = req.body.email.trim();
     var password = req.body.password.trim();
     var payload = req.body;

     if(firstName && lastName && username && email && password){
         // User.findOne; here User is our table or cluster name
        var user = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]// it will check if any one of these exist.
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage = "Something went wrong";
            res.status(200).render("register",payload);
        });

        if(user == null){
            // User does not found
            
            var data = req.body;
            data.password = await bcrypt.hash(password, 10); 
            User.create(data)
            .then((user)=>{
                req.session.user = user;
                console.log(user);
                console.log("");
                console.log(req.session.user);
                return res.redirect("/");
            })
        }
        else{
            // User found
            if( email = user.email){
                payload.errorMessage = "Email Already Exists";
                res.status(200).render("register",payload);
            }
            else{
                payload.errorMessage = "Username Already Exists";
                res.status(200).render("register",payload);
            }
        }
     }
     else{
        payload.errorMessage = "Make sure no fields are empty";
        res.status(200).render("register",payload);
     }

     
 })
module.exports = router;