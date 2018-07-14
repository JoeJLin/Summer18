const mongoose = require('mongoose');

const Schema= mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

//add salt
//pre function, add salt before the save function executed
UserSchema.pre('save', function(next){
  const user = this;

  // auto-gen a salt and hash
  // 10 is the saltRounds
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

//check username and password
UserSchema.statics.authenticate = function (username, password, next) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return next(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return next(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return next(null, user);
        } else {
          return next();
        }
      });
    });
}

UserSchema.statics.findUser = (username, next) => {
  User.findOne({ username : username }, (err, user) => {
    if(err) {
      return next(err)
    } else if (!user) {
      console.log('Username available')
    } else {
      console.log('User exists');
    }
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
