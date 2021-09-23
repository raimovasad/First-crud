const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {body, validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')


router.get('/login',async(req,res)=>{
    res.render('auth/login',{
        title: 'Authorisation',
        isLogin: true,
        regError: req.flash('regError'),
        logEmailError: req.flash('logEmailError'),
        logPassError: req.flash('logPassError')
    })
})


router.get('/logout',async(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/auth/login#login')

    })
})

router.post('/login',async(req,res)=>{
    try{

const {email, password} = req.body
const candidate = await User.findOne({email})
if(candidate ){
    const areSame = await bcrypt.compare(password, candidate.password)
    if(areSame){
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err=>{
            if(err) throw err
            res.redirect('/')
           
        })

    }else{
        req.flash('logPassError','Inserted wrong password:(')
        res.redirect('/auth/login#login')
    }
}else{
    req.flash('logEmailError','User doesn\'t exist:(')
    res.redirect('/auth/login#login')
}
    }
    catch(e){
        console.log(e);
    }
  
})

router.post('/register',registerValidators, async (req,res)=>{
    try{
        const {email, password,name} = req.body
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            req.flash('regError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
     
            const hashPassword = await bcrypt.hash(password,10)
            const user = new User({
                email, name,password:hashPassword, cart:{items:[]}
            })
         
            await user.save()
          res.redirect('/auth/login#login')
        
    }catch(e){
        console.log(e);
    }
})



module.exports = router