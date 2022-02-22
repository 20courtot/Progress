var bcrypt = require("bcrypt-nodejs");

module.exports = (mongoose) => {
  var UserSchema = new mongoose.Schema({
    surname: String,
    lastname: String,
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    type: String,
  });

  UserSchema.pre("save", function (next) {
    var user = this;
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      });
    } else {
      return next();
    }
  });

  UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  const User = mongoose.model("users", UserSchema);

  return User;
};
