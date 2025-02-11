const router =require("express").Router();
const connection = require("../DB/dbConnection");
const admin= require("../middleware/admin");
const upload =require("../middleware/auctionImage");
const util = require("util");
const fs =require("fs");
const e = require("express");

router.get("",admin,async(req , res)=>{
    const query = util.promisify(connection.query).bind(connection);
    const usersataus= await query("select * from `users` where status ='Inactive'");
    if(!usersataus){
       return res.status(404).json({
        msg: "No users in waitting list",
        });
    };
    
    usersataus.map((user)=>{
        user.image= "http://"+ req.hostname+ ":4000/"+user.image;
        // select * from `auction model` where (StartDate> CURDATE()) and (name LIKE 'cars' or Description LIKE 'good')
    });
    
    res.status(200).json(usersataus);

});

router.put(
    "/:id/Accept",
    admin,

async(req , res)=>{

    try{
            const query = util.promisify(connection.query).bind(connection);
        const satausCheck=await query("select * from users where ID= ?",req.params.id);        
        if(!satausCheck[0]){
            res.status(404).json({
                errors:[
                    {
                        msg: "user not found"
                    }
                ]
                
            })
        }
       
       else {
        await query("update users set status= ? where id = ?",["Active",satausCheck[0].ID]);

        res.status(200).json({
            errors:[
                {
                    msg: "Accepted user succesfully"
                }
            ]
           
        })

       }

        
        
    }catch(err){
        res.status(500).json(err);
    }

});



router.put(
    "/:id/Reject",
    admin,

async(req , res)=>{

    try{
            const query = util.promisify(connection.query).bind(connection);
        const satausCheck=await query("select * from users where ID= ?",req.params.id);        
        if(!satausCheck[0]){
            res.status(404).json({
                errors:[
                    {
                        msg: "user not found"
                    }
                ]
                
            })
        }
       
       else {
        await query("update users set status= ? where id = ?",["Reject",satausCheck[0].ID]);

        res.status(200).json({
            errors:[
                {
                    msg:"Rejected user succesfully",
                }
            ]
            
        })

       }

        
        
    }catch(err){
        res.status(500).json(err);
    }

});

module.exports=router;