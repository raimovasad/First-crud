const {Router} = require('express')
const Cloth = require('../models/Cloth')
const router = Router()
const auth = require('../middleware/auth')
const {clothValidators} = require('../utils/validators')
const {validationResult} = require("express-validator")

router.get('/',auth,(req,res)=>{

    res.render('join-cloth',{
        title: 'New Cloth',
        isJoin: true
    })
})
router.post('/add',auth,clothValidators,async(req,res)=>{
    const errors = validationResult(req)


    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('join-cloth',{
            title:' Join Cloth',
            isJoin: true,
            error: errors.array()[0].msg
        })
    }
    const cloth = new Cloth({
        type: req.body.type,
        price: req.body.price,
        image: req.body.image,
        userId: req.user
    })
    try{
        await cloth.save()
    res.redirect('/clothes')

    }catch(e){
        console.log(e);
    }
})

module.exports = router