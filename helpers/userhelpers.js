var db= require('../config/mongo')
var collection=require('../config/collections')
const bcrypt = require('bcrypt')
const { resolve, reject } = require('promise')
const { Console } = require('node:console')
var objectId =require('mongodb').ObjectID
const { response } = require('express')
const { pipeline } = require('node:stream')
module.exports = {

    signup:(userdata)=>{
        
       return new Promise(async(resolve,reject)=>{
        userdata.Password = await bcrypt.hash(userdata.Password,10)
        console.log("Input :" + userdata.Password)
       let data=db.get().collection('user').insertOne(userdata).then((data)=>{
       resolve(data.ops[0]) })
       })  

 
    },

    doLogin:(userdata)=>{
     
      return new Promise(async(resolve,reject)=>{
         var status = false
         var response={}
         let user= await db.get().collection('user').findOne({Email:userdata.Email})
   
       
    if(user)
         {
            bcrypt.compare(userdata.Password,user.Password).then((status)=>{
               if(status) {

               
                   response.user=user;
                 //console.log(user);
                  resolve(user)
                
               }
               else
               { 
                   console.log("failed")
                   resolve(false)
            }
         })

      }
      else {
        console.log("Login failed")
        resolve(false)
      }

      })
    },

    addcart:(proId,userId)=>{
       return new Promise(async(resolve,reject)=>{
          let userCart= await db.get().collection('product').findOne({user:objectId(userId)})
          if(userCart){

            db.get().collection('cart').updateOne({user:objectId(userId)},{
            
          $push:{products:objectId(proId)}

          }
       ).then((response)=>resolve())
         }
          else{

            let cart = {
               user: objectId(userId),
               product:objectId(proId)
            }

            db.get().collection('cart').insertOne(cart).then((response)=>{
               resolve()
            })

          }


       })
    },

    getCart:(id)=>{

      return new Promise(async(resolve,reject)=>{

         let cartItems = await  db.get().collection('cart').aggregate([
           
            {
               $match:{user:objectId(id)}
            },

            {

               $lookup:{
                  from:collection.PRODUCT_COLLECTION,
                  let : {prod:'$product'},
                  pipeline:[
                     {
                        $match:{

                           $expr:{

                              $in:['$_id',"$$prod"]


                              }


                           }
                        }
                     
                  ],
                  as:'cartItems'

               }
            }
        


         ]).toArray()
         resolve(cartItems)

      })
       
   }

   }
