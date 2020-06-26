import {check} from 'express-validator';
import User from '../model/user.model';

const is_unique = async (data, type) => {
    let obj;
    if (type === 'email') {
        obj = {email: data};
    } else if (type === 'username') {
        obj = {username: data};
    }
    let result=null
     await User.findOne(obj, (err, data) => {
        if (err) {
            // Internal server error
            res.status(500).send({msg: "Internal Server Error"});
        } else {
            if (data === null) {
                console.log('returning unique');
                result=true;
            } else {
                console.log('returning not unique');
                result=false;
            }
        }
        ;
    });
    return result
}
const user_validator = {};
user_validator.check_username = () => {
    return check('username').not().isEmpty().custom(async username => {
        let result = await is_unique(username, 'username')
        console.log(result)
        if (!result) {
            console.log('User name taken')
            throw new Error('User name taken')
        }
        console.log('unique username')
        return username;
    })
}
user_validator.check_email = () => {
    return check('email').not().isEmpty().isEmail().custom(async email => {
        let result = await is_unique(email, 'email')
        console.log(result)
        if (!result) {
            console.log('Email taken')
            throw new Error('Email taken')
        }
        console.log('unique email')
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