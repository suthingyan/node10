var mongoose=require('mongoose');
var Scheme=mongoose.Schema;
var bcrypt=require('bcryptjs');
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
UserSchema.pre('save',function(next){
    this.password=bcrypt.hashSync(this.password,bcrypt.genSaltSync(8),null);
    next();
})
UserSchema.statics.compare=function(cleartext,encrypted){
    return bcrypt.compareSync(cleartext,encrypted);
}
module.exports=mongoose.model("Users",UserSchema);