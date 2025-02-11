const router =require("express").Router();
const connection = require("../DB/dbConnection");
//doom
// const express = require("express");
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const socketIO = require('socket.io');
// const io = socketIO(server);
// const pool = connection.pool;
//doom

const authoized= require("../middleware/authorize");
const admin= require("../middleware/admin");
const {body,validationResult}=require('express-validator');
const upload =require("../middleware/auctionImage");
const util = require("util");
const fs =require("fs");


//doom

//post  get data from user  and insert in daate base
//put   get data from user and update in daate base
//get      get data from user and view from daate base

//doom

//create
router.post(
    "/create",
authoized,
upload.single("image"),
body("Name").isString().withMessage("plz enter a valid name").isLength({min:4}).withMessage("name  sholud be at least 4 charcater"),
body("Description").isString().withMessage("plz enter a valid Description").isLength({min:5}).withMessage("name  sholud be at least 5 charcater"),
dateStart=body("StartDate").isISO8601().withMessage("Start date must be a valid date-time string (YYYY-MM-DDTHH:mm:ss)")
.custom((value, { req }) => {
    if (new Date(value) <= new Date()) {
        throw new Error("Start date must be in the future");
    }
    return true;
}),

body("EndDate").isISO8601().withMessage("Finish date must be a valid date-time string (YYYY-MM-DDTHH:mm:ss)")
.custom((value, { req }) => {
    if (new Date(value) <= new Date(dateStart)) {
        throw new Error("Finish date must be in the future");
    }
    return true;
}),
body("Bid_Number").isInt().withMessage("plz enter a BIdNumber"),

async(req , res)=>{

    try{
        const query = util.promisify(connection.query).bind(connection);
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
        }
        
        if(!req.file){
            res.status(404).json({
                errors:[
                    {   
                        msg:"image is required !"
                    },
                ],

            });

        }
        
        else if(res.locals.user.status=="Inactive"){
            res.status(200).json({
                errors:[
                    {   
                        msg:"you not get aprrove  from admin yet"
                        
                    },
                ],

            });
            fs.unlinkSync("./Assets/AuctionImage/"+req.file.filename);

            
        }
        else if(res.locals.user.status=="Reject"){
            res.status(200).json({
                errors:[
                    {   
                        msg:"you are  rejected by admin"
                    },
                ],

            });
            fs.unlinkSync("./Assets/AuctionImage/"+req.file.filename);

        }
        else
        {
            const auction={
            Email:res.locals.user.Email,
            Name:req.body.Name,
            Description: req.body.Description,
            image:req.file.filename,
            StartDate:req.body.StartDate,
            EndDate:req.body.EndDate,
            Bid_Number:req.body.Bid_Number,
            }

            await query("insert into `auction model` set ?",auction);
            res.status(200).json({
                msg: "auction created"
            });

        }
    }catch(err){
        res.status(500).json(err);
    }

});


//update
router.put(
    "/:id/update",
authoized,
upload.single("image"),
body("Name"),
body("Description"),
body("StartDate"),
body("EndDate"),
body("Bid_Number"),
async(req , res)=>{

    try{
        const query = util.promisify(connection.query).bind(connection);
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
        }
        const auctionU=await query("select *from `auction model` where id = ?",[req.params.id]);
        const  checkMainAuction=await query("select *from users where Email = ?",res.locals.user.Email);
         if(!auctionU[0]){
            res.status(404).json({
                msg: "auction not found"
            })
        }
       
        else if(res.locals.user.Email!=auctionU[0].Email)
        {
            res.status(400).json({
                errors:[
                    {   
                        msg: "dont have acess to update this auction"
        
                    },
                ],
        
            });
        }

        else
        {
            const auctionUpdate={
                Name:req.body.Name?req.body.Name:auctionU[0].Name,
                Description: req.body.Description ? req.body.Description : auctionU[0].Description,
                Bid_Number:req.body.Bid_Number ? req.body.Bid_Number : auctionU[0].Bid_Number,
                EndDate:req.body.EndDate ? req.body.EndDate : auctionU[0].EndDate,
                StartDate:req.body.StartDate ? req.body.StartDate : auctionU[0].StartDate,

            }
            if(req.file){
                auctionUpdate.image=req.file.filename;
                fs.unlinkSync("./Assets/AuctionImage/"+auctionU[0].image);

            }
            await query("update `auction model` set ? where id = ?",[auctionUpdate,auctionU[0].id]);
            res.status(200).json({
                msg: "auction updated"
            });

        }
       
        
       

        
    }catch(err){
        res.status(500).json(err);
    }

});

// delete
router.put(
    "/:id/delete",
authoized,

async(req , res)=>{

    try{
            const query = util.promisify(connection.query).bind(connection);
        const auctionD=await query("select * from `auction model` where id = ?",req.params.id);        
        if(!auctionD[0]){
            res.status(404).json({
                msg: "auction not found"
            })
        }
       
       else if(res.locals.user.Email==auctionD[0].Email){
        await query("delete from `auction model`  where id = ?",[auctionD[0].id]);
        fs.unlinkSync("./Assets/AuctionImage/"+auctionD[0].image);
        res.status(200).json({
            msg:"auction delete succesfully",
        })

       }
       else{
        res.status(200).json({
            msg: "Dont have acess to delete this auction"
        })
    }
        
        
    }catch(err){
        res.status(500).json(err);
    }

});

//list
router.get("",async(req , res)=>{
        const query = util.promisify(connection.query).bind(connection);
    let search="";
    if(req.query.search){
        search=`where (name LIKE '%${req.query.search}%' or Description LIKE '%${req.query.search}% )`;

    }
    // where (StartDate< CURDATE()) and
    // const auctions= await query(`select * from `+`auction model` +`${search}`);  
    const auctions= await query("select * from `auction model`" + `${search}`);  
    auctions.map((auction)=>{
        auction.image= "http://"+ req.hostname+ ":4000/"+auction.image;
        // select * from `auction model` where (StartDate> CURDATE()) and (name LIKE 'cars' or Description LIKE 'good')
    });
    res.status(200).json(auctions);

});


//show auction
router.get("/:id",async(req , res)=>{
    const query = util.promisify(connection.query).bind(connection);
    const auction= await query("select * from auction model where id = ?",[req.params.id]);
    if(!auction[0]){
        res.status(404).json({
            msg: "auction not found",
        });
    };
    auction[0].image= "http://"+ req.hostname+ "3306" +auction[0].image;
    res.status(200).json(auction[0]);

});



router.post("/review",authoized,(req , res)=>{
    res.status(200).json({
        msg: 'auction added',
    });

});




//dooom






// io.on('connection', socket => {
//     console.log(`Socket ${socket.id} connected`);
  
//     // Query the items from the database and send them to the client
//     pool.query('SELECT * FROM `auction model`', (err, rows) => {
//       if (err) {
//         return socket.emit('error', err.message);
//       }
  
//       socket.emit('auction model', rows);
//     });
  
//     // Listen for bid events from the client
//     socket.on('bid', data => {
//       const { itemId, newBid } = data;
  
//       // Start a transaction to update the bids
//       pool.getConnection((err, conn) => {
//         if (err) {
//           return socket.emit('error', err.message);
//         }
  
//         conn.beginTransaction(err => {
//           if (err) {
//             return socket.emit('error', err.message);
//           }
  
//           // Lock the row for the item being bid on
//           conn.query('SELECT * FROM `auction model` WHERE id = ? FOR UPDATE', [itemId], (err, rows) => {
//             if (err) {
//               conn.rollback(() => {
//                 socket.emit('error', err.message);
//                 conn.release();
//               });
//               return;
//             }
  
//             if (rows.length === 0) {
//               conn.rollback(() => {
//                 socket.emit('error', `auction model ` +` with ID ${itemId} not found`);
//                 conn.release();
//               });
//               return;
//             }
  
//             const item = rows[0];
//             const currentBid = item.current_bid || item.starting_bid;
  
//             if (newBid <= currentBid) {
//               conn.rollback(() => {
//                 socket.emit('error', `Bid must be higher than ${currentBid}`);
//                 conn.release();
//               });
//               return;
//             }
  
//             // Update the current_bid for the item
//             conn.query('UPDATE `auction model` SET Bid_Number = ? WHERE id = ?', [newBid, itemId], (err, result) => {
//               if (err) {
//                 conn.rollback(() => {
//                   socket.emit('error', err.message);
//                   conn.release();
//                 });
//                 return;
//               }
  
//               conn.commit(err => {
//                 if (err) {
//                   conn.rollback(() => {
//                     socket.emit('error', err.message);
//                     conn.release();
//                   });
//                   return;
//                 }
  
//                 // Broadcast the new bid to all clients
//                 io.emit('newBid', { itemId, newBid });
//                 conn.release();
//               });
//             });
//           });
//         });
//       });
//     });
  
//     // Socket.io disconnection event
//     socket.on('disconnect', () => {
//       console.log(`Socket ${socket.id} disconnected`);
//     });
//   });




///doooom

module.exports=router;