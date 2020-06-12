const { check } = require ('express-validator');
const User = require('../model/user.model');

// const unique_email = (email) => {
//     User.findOne({email}, (err, data) => {
//         if (err) {
//             // Internal server error
//             res.status(500).send({msg: "Internal Server Error"});
//         } else {
//             if (data.length !== 0) {
//                 return false;
//             }
//             else {
//                 return true;
//             }
//         };
//     });
// }
const is_unique = async (data, type) => {
    if (type === 'email') {
        obj = { email:data };
    } else if (type === 'username') {
        obj = { username:data };
    }
    await User.findOne(obj, (err, data) => {
        if (err) {
            // Internal server error
            res.status(500).send({msg: "Internal Server Error"});
        } else {
            if (data === null) {
                return true;
            }
            else {
                return false;
            }
        };
    });
}
const user_validator = {};

user_validator.check_username = () => {
    return check('username').not().isEmpty().custom(username => {
        console.log('username --> ', is_unique(username,'username'));
        if (!is_unique(username,'username')) {
            throw new Error('Username already taken')
          }
          return username;
    })
}

user_validator.check_email = () => {
    return check('email').not().isEmpty().isEmail().custom(email => {
        console.log('email --> ', is_unique(email,'email'));
        if (!is_unique(email,'email')) {
        throw new Error('Email already registered')
      }
      return email;
    })
}

user_validator.check_password = () => {
    return check('password').not().isEmpty();
}

user_validator.check_phone = () => {
    return check('phone').not().isEmpty().isMobilePhone();
}

module.exports = user_validator;