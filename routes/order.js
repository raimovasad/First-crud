const {
    Router
} = require('express')
const router = Router()
const Order = require('../models/Order')
const auth = require('../middleware/auth')



router.get('/',auth, async (req, res) => {
    try {
        const orders = await Order.find({
                'user.userId': req.user._id
            })
            .populate('user.userId')
                
        res.render('order', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.clothes.reduce((total, c) => {
                        return total += c.count * c.cloth.price
                    }, 0)
                }
            })
        })

    } catch (e) { 
        console.log(e);
    }
})
router.post('/',auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.clothId')
            .execPopulate()
        const clothes = user.cart.items.map(c => ({
            count: c.count,
            cloth: {
                ...c.clothId._doc
            }
        }))
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            clothes
        })
        await order.save()
        await req.user.clearCart()
        res.redirect('/order')
    } catch (e) {
        console.log(e);
    }
})
module.exports = router