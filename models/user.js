const {Schema, model, SchemaType} =  require('mongoose')

const userSchema = new Schema({
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:String,
    avatarUrl: String,
    cart:{
        items:[
            {
                count:{
                    type:Number, 
                    required: true,
                    default: 1
                },
                clothId:{   
                    type: Schema.Types.ObjectId,
                    required:true,
                    ref:'Cloth'
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(cloth){
    const items = [...this.cart.items]
    const idx = items.findIndex(c=>{
        return c.clothId.toString() === cloth._id.toString()
    }) 
    if(idx >= 0){
        items[idx].count = items[idx].count + 1
    }else{
        items.push({
            clothId: cloth._id,
            count: 1
        })
    }
    this.cart = {items}
    return this.save()
    
}
userSchema.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    const idx = items.findIndex(c=> c.clothId.toString() === id.toString())
    if(items[idx].count === 1){
        items = items.filter(c=> c.clothId.toString() !== id.toString())

    }else{
        items[idx].count--
    }
    this.cart = {items}
    return this.save()
}
userSchema.methods.clearCart = function(){
    this.cart = {items:[]}
    return this.save()
}
module.exports = model('User', userSchema)