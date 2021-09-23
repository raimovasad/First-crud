const {Router} = require('express')
const Cloth = require('../models/Cloth')
const router = Router()
const auth = require('../middleware/auth')


function mapCloth(cart){
return cart.items.map(c=>({
    ...c.clothId._doc,
    count: c.count,
    id: c.clothId.id
}))
}
function computePrice(clothes) {
    return clothes.reduce((total,cloth)=>{
        return total += cloth.price * cloth.count
    },0)
  }

router.get('/',auth,async(req,res)=>{
    const user  = await req.user
    .populate('cart.items.clothId').execPopulate()
    const clothes = mapCloth(user.cart)
    res.render('card',{
        title: 'Buying Clothes',
        isBuy: true,
        clothes,
        price: computePrice(clothes)
    })
})

router.post('/',auth,async(req,res)=>{
    const cloth = await Cloth.findById(req.body.id)
     await  req.user.addToCart(cloth)
    res.redirect('/card')
})

router.delete('/remove/:id',auth, async(req,res)=>{
    await req.user.removeFromCart(req.params.id)
   
    const user = await req.user.populate('cart.items.clothId').execPopulate()
   const clothes = mapCloth(user.cart)
    const  cart = {
        clothes,
        price: computePrice(clothes)

   }
    res.status(200).json(cart)
})
 
module.exports = router  