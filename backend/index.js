const express= require("express");
const app =express();



app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("Assets/AuctionImage"));
app.use(express.static("Assets/userImage"));
const cors =require("cors");
app.use(cors());



const auth=require("./routes/Auth");
const auction=require("./routes/Auction");
const bidauction=require("./routes/BidAuction");
const manageUsers=require("./routes/ManageUsers");
const util = require('util');
const connection = require("./DB/dbConnection");


// Define the GetAuction function
const GetAuction = async () => {
    const query = util.promisify(connection.query).bind(connection);
    const Auction = await query('SELECT * from `auction model` WHERE isPayed=0');
  
    for (let i = 0; i < Auction.length; i++) {
      if (new Date(Auction[i].EndDate) <= new Date()) {
         await query('UPDATE `auction model` SET `isPayed` = 1 WHERE id = ?', [Auction[i].id]);
         if(Auction[i].Bid_Email){
            await query('UPDATE `history` SET `IsPayed` = 1 WHERE `Auction_ID` = ? and `Email` =?', [Auction[i].id,Auction[i].Bid_Email]);

         }
  
      }
    }
  }
 

app.listen(4000,"localhost",()=>{
    console.log("server is  running");
    setInterval(() => {
        GetAuction();
      }, 1000*30);
});

// Import the GetAuction function

// Call the GetAuction function before starting the server

app.use("/auth",auth);
app.use("/auction",auction);
app.use("/bidauction",bidauction);
app.use("/manageUsers",manageUsers);