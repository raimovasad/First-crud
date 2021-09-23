const {Router} = require('express')
const router = Router()
const Cloth = require('../models/Cloth')
const auth = require('../middleware/auth')


router.get('/',async(req,res)=>{
    const clothes = await Cloth.find()
    .populate('userId','email name').select('type image price')

    res.render('clothes',{
        title: 'Clothes',
        isCloth: true,
        clothes
    })
})
router.get('/cloth/:id',async(req,res)=>{
const cloth = await Cloth.findById(req.params.id)
res.render('cloth',{
    title: `${cloth.type}`,
    cloth
})
})

router.post('/remove',auth,async(req,res)=>{
  try{
      await  Cloth.deleteOne({ 
          _id: req.body.id
      })
      res.redirect('/clothes')
}
catch(e){
    console.log(e);
}

})


router.post('/',auth,(req,res)=>{
    res.redirect('/clothes')
})

module.exports = router