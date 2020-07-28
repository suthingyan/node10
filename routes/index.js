var express=require('express');
var router=express.Router();
var User=require('../model/User')
var Admin=require('../model/Admin');
var validator=require('email-validator');
var passwordValidator=require('password-validator');
var schema=new passwordValidator();
//add properties to it
schema
.is().min(8)                                   //Mininum Length 8
.is().max(100)                                 //Maximum Length 100
.has().uppercase()                             //Must has uppercase letters
.has().lowercase()                             //Must has lowrecase letters
.has().digits()                                //Must has digits
.has().not().spaces()                          //Should not has spaces
.is().not().oneOf(['Password','Password123']); //Blacklist these values

router.get('/',function(req,res){
    var user=req.session.user ?req.session.user.name:'unknown';
    console.log(user);
    res.render('index',{user:user})
});
router.get('/home',function(req,res){
    res.render('home',{name:'We Love U Khar'});
})
router.get('/signup',function(req,res){
    res.render('signup');
})
router.post('/signup',function(req,res){
    var admin=new Admin();
    admin.name=req.body.name;
    admin.email=req.body.email;
    admin.password=req.body.pwd;
    admin.save(function(err,rtn){
        if(err)throw err;
        res.redirect('/');
    })
})
router.get('/signin',function(req,res){
    res.render('signin');
})
router.post('/signin',function(req,res){
    Admin.findOne({email:req.body.email},function(err,rtn){
        if(err)throw err;
        if(rtn!=null && Admin.compare(req.body.pwd,rtn.password)){
req.session.user={name:rtn.name,email:rtn.email};
res.redirect('/');
        }else{
            res.redirect('/signin');
        }
    })
})
router.get('/logout',function(req,res){
    req.session.destroy(function(err,rtn){
        if(err)throw err;
        res.redirect('/')
    })
})
router.post('/passdu',function(req,res){
    Admin.findOne({email:req.body.email},function(err,rtn){
        if(err)throw err;
        if(rtn== null && validator.validate(req.body.email)){
            res.json({status:false});
        }
        else{
            res.json({status:true})
        }
    })
})
module.exports=router;