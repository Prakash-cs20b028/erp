const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    phone:{
        type: Number,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})



//hashing the password

adminSchema.pre('save', async function(next){
    console.log("Hello Friends")
    if(this.isModified('password')){
       this.password = await bcrypt.hash(this.password, 12);
    }
    next();
} );

// generating token

adminSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch(err){
        console.log(err);
    }
}
const Admin = mongoose.model('ADMIN',adminSchema);

module.exports = Admin;
