const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/user');
const bcrypt = require('bcrypt');
const e = require('express');

app.use(bodyParser.urlencoded({extended: false}));

router.get("/:id",(req,res,next)=>{  

     var payload = {
          pageTitle: "View post",
          userInfo: req.session.user,
          userInfoJs: JSON.stringify(req.session.user),
          postId: req.params.id
      }

     res.status(200).render("postPage",payload);
})


module.exports = router;