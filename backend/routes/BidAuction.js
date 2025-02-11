const router= require('express').Router();
const connection =require("../DB/dbConnection");
const {body,validationResult}=require('express-validator');
const authoized= require("../middleware/authorize");
const admin= require("../middleware/admin");
const util = require("util");


router.post(
    "/:id",
authoized,
body("Bid_Number").isInt().withMessage("plz enter a BIdNumber"),

async(req , res)=>{

    try{
        const query = util.promisify(connection.query).bind(connection);
        const errors= validationResult(req);
        const auctionD=await query("select * from `auction model` where id = ?",req.params.id);        

        if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
        }
        
        else if(res.locals.user.status=="Inactive"){
            res.status(400).json({
                errors:[
                    {   
                        msg:"you not get aprrove  from admin yet"

                    },
                ],

            });

            
        }
        else if(res.locals.user.status=="Reject"){
            res.status(400).json({
                errors:[
                    {   
                        msg:"you are  rejected by admin"
                    },
                ],

            });

        }
        
        else if(auctionD[0].Bid_Number>=req.body.Bid_Number){
            res.status(400).json({
                errors:[
                    {   
                        msg:"you sholud bid more than "+auctionD[0].Bid_Number+"$"
                    },
                ],

            });

        }
        else if(auctionD[0].Email==res.locals.user.Email){

            res.status(400).json({
                errors:[
                    {   
                        msg:"you cant bid on your auction"
                    },
                ],

            });

        }
        else if(new Date(auctionD[0].EndDate)<=new Date()){
            res.status(400).json({
                errors:[
                    {   
                        msg:"time bid is out"
                    },
                ],

            });


        }
        else if(new Date(auctionD[0].StartDate)>=new Date()){
            res.status(400).json({
                errors:[
                    {   
                        msg:"Not bidding startting yet"
                    },
                ],

            });


        }


        
        else 
        {

            const auction=
            {
                Bid_Email:res.locals.user.Email,
                Bid_Number:req.body.Bid_Number,
            }

            await query("update `auction model` set ? where id = ?",[auction,auctionD[0].id]);
            const BidHistory =await query("seLect * from `history` where Auction_ID = ? AND Email = ?",[req.params.id,res.locals.user.Email]);
            const bidData=
                {
                    Auction_ID:req.params.id,
                    Email:res.locals.user.Email,
                    Bid:req.body.Bid_Number

                }
            if(BidHistory[0])
            {

                await query("update `history` set ? where Auction_ID = ?",[bidData,bidData.Auction_ID]);

                

            }
            else
            {
                
                await query("insert into `history` set ? ",bidData);

            }
            


            res.status(200).json({
                msg: "bid successfully"
            });
            
               
                

        }
           

        
    }catch(err){
        res.status(500).json(err);
    }

});
module.exports=router;