const {Router} = require('express')
const router = Router()
const Cloth = require('../models/Cloth')
const auth = require('../middleware/auth')
const { clothValidators } = require('../utils/validators')
const {validationResult} = require('express-validator')


router.get('/:id',auth,async(req,res)=>{
        const cloth = await Cloth.findById(req.params.id)
    res.render('change',{
        title: `Changing ${cloth.type}`,
        cloth
    })
})



router.post('/',auth,clothValidators,async(req,res)=>{
    const errors = validationResult(req)
    const {id} = req.body

    if(!errors.isEmpty()){
        return res.status(422).redirect(`/change/${id}`)
    }
    
    delete req.body.id 
    await Cloth.findByIdAndUpdate(id, req.body)
    res.redirect('/clothes')
})


module.exports = router 



