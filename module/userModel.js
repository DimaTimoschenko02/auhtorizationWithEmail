const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    email:{
        type: String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    isActivated:{
        type:Boolean,
        default:false
    },
    activationLink:{
        type:String
    }
})

module.exports = model('User' , UserSchema)