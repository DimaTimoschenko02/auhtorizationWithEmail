const { model, Schema } = require("mongoose");

const TokenSchema = new Schema({
    userId:{
        required:true,
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    refreshToken:{
        required:true,
        type:String
    }
})

module.exports = model('Token' , TokenSchema)