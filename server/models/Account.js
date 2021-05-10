const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};
/*
AccountSchema.statics.changePassword = (username, originalPass, newPass, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      console.log('Error in changePassword\'s findByUsername call!');
      return callback(err);
    }

    if (!doc) {
      console.log('No doc in changePassword\'s findByUsername call!');
      return callback();
    }

    const docParam = [...doc];

    return validatePassword(docParam, originalPass, (result) => {
      if (result === true) {
        //  Valid password, set new pass
        crypto.pbkdf2(newPass, doc.salt, iterations, keyLength, 'RSA-SHA512', (err2, hash) => {
          if (err2) console.log(err2);
          docParam.password = hash.toString('hex');
          const savePromise = docParam.save();
          savePromise.then(() => callback());
        });
      } else {
        console.log('Incorrect password validation in changePassword');
      }
    });
  });
};
*/

AccountSchema.statics.changePassword = (id, salt, hash, callback) => {
  const newData = {
    password: hash,
    salt,
  };

  AccountModel.findByIdAndUpdate(id, newData, (err, result) => {
    if (err) return callback(err);
    return result;
  });

  return callback();
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
