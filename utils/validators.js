const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [

    body('email')
    .isEmail().withMessage('Input correct email!!')
    .custom(async(value,{req})=>{
        try{
            const user = await User.findOne({email: value})
            if(user){
                return Promise.reject('The email exists!!!!')
            }
        }catch(e){
            console.log(e);
        }
    })
    .normalizeEmail(),
    body('password','Password should be minimum 6 symbols ')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
    body('confirm').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Passwords should be same!')
        }
        return true
    }).trim(),
    body('name').isLength({min:3})
    .withMessage('Name should contain 3 symbols').trim()
]


exports.clothValidators = [
    body('type').isLength({min:3}).withMessage('Minimum 3 symbols '),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('image','Enter the url adress of the image').isURL()
]