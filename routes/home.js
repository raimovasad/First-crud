const {Router} = require('express')
const router = Router()


router.get('/',(req,res)=>{
    res.render('index',{
        title: 'Welcome to Cloth shop',
        
    })
})

module.exports = router