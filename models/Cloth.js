const {Schema,model} = require('mongoose')

const clothSchema = new Schema({

    type:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        reqired: true
    },
    image: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }


})
clothSchema.method('toClient', function(){
    const cloth = this.toObject()
    cloth.id = cloth._id
    delete cloth._id
})


module.exports = model('Cloth',clothSchema)