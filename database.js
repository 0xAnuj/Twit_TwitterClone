const mongoose = require('mongoose');
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useUnifiedTopology',true);

class Database{

     constructor(){
          this.connect();
     }

     connect(){
          mongoose.connect("mongodb+srv://admin:<Password>@cluster0.jbdek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
          .then(() => {
          console.log("Db Connected Succesfully");
          })
          .catch((err) => {
          console.log("Error connecting db" + err);
          })
     }
}

module.exports = new Database;