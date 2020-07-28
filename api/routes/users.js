var express=require('express');
const User=require('../../model/User');
const {update}=require('../../model/User');
const { route } = require('../routes/Admin');
var router=express.Router();
var checkAuth=require('../middleware/check-auth')
var bcrypt=require('bcryptjs');
router.get('/list',checkAuth,function(req,res){
    User.find(function(err,rtn){
        if(err){
res.status(500).json({message:'Internal Server Error',error:err})
        }
        else{
          res.status(200).json({users:rtn});
        }
    })
})
router.get('/add',checkAuth,function(req,res){
User.findOne({email:req.body.email},function(err2,rtn2){
    if(err2){
        res.status(500).json({message:'Internal Server Error',error:err2});
    }
    else{
        if(rtn2!= null){
            res.status(500).json({message:'Duplicate email'})
        }
        else{
            var user=new User();
            user.name=req.body.name;
            user.email=req.body.email;
            user.password=req.body.password;
            user.save(function(err,rtn){
                if(err){
                    res.status(500).json({message:'Internal Server Error',error:err})
                }
                else{
                    res.status(200).json({message:'User created success',users:rtn})
                }
            })
        }

    }
})
})
router.get('/detail/:id',checkAuth,function(req,res){
    User.findById(req.params.id,function(err,rtn){
        if(err){
            res.status(500).json({message:'Internal Server Error',error:err})
        }
        else{
            if(rtn==null){
res.status(404).json({message:'Not found content'})
            }
            else{
                res.status(200).json({user:rtn})
            }
        }
    })
})
router.patch('/:id',checkAuth,function(req,res){
    var update={
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8),null)
    };
    User.findByIdAndUpdate(req.params.id,{$set:update},function(err,rtn){
        if(err){
            res.status(500).json({message:'Internal Server Error',error:err})
        }
        else{
            res.status(200).json({user:rtn})
        }
    })
})
router.get('/delete/:id',function(req,res){
    User.findOneAndRemove(req.params.id,function(err,rtn){
        if(err){
            res.status(500).json({message:"Internal server error",error:err})
        }
        else{
            res.status(200).json({message:"Post delete success"})
        }
    })
})
module.exports=router;