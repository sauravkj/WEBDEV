var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var productHelper= require('../helpers/producthelp')
const userhelper =require('../helpers/userhelpers')
const verifyLogin=(req,res,next)=>{
  
  if(req.session.loggedIn){
    
      next()
    }
 else{
    res.redirect('/login')
 } 
   
 
}
router.get('/',function(req,res,next){

  let user=req.session.user
  productHelper.getAllProducts().then((products)=>{
    
    res.render('user/viewprod',{products,user})

    
   })

})


router.get('/login',(req,res)=>{


    if(req.session.loggedIn){
          res.redirect('/')
    console.log("Login: " + req.session.loggedIn)
    }

    else {
          res.render('user/login',{loggedErr:req.session.loggedErr})
          req.session.loggedErr=false
    }
  })

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
 
  userhelper.signup(req.body).then((response)=>{
  console.log(response)
  req.session.loggedIn=true
  req.session.user=response
  res.redirect('/')
} )
})

router.post('/login',(req,res)=>{
 
  userhelper.doLogin(req.body).then((response)=>{
    
    if(response) 
    { 
      
     req.session.user = response
     req.session.loggedIn=true
     res.redirect('/login')
    }
    else {
      req.session.loggedErr=true
      res.redirect('/login')
    
     
    }
} )
  
})

router.get('/logou',(req,res)=>{
 req.session.destroy()
 res.redirect('/login')
})

router.get('/cart',verifyLogin,async(req,res)=>{
 let product =await userhelper.getCart(req.session.user._id)
 //console.log(product)
 res.render('user/cart')

 })

router.get('/addcart/:id',verifyLogin,(req,res)=>{

  console.log('hi ' + req.params.id)
  userhelper.addcart(req.params.id,req.session.user._id)
  res.redirect('/')
})
  



module.exports = router;
