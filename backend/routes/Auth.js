const router= require('express').Router();
const connection =require("../DB/dbConnection");
const util = require("util");
const {body,validationResult}=require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const upload =require("../middleware/uploadImages");
const fs =require("fs");
const authoized = require('../middleware/authorize');




//login
router.post(
    "/login",
    body("Email").isEmail().withMessage("please  enter valid email"),
    body("password").isLength({min:4 ,max:26}).withMessage("enter  naem  btween  4 and  26 charcter"),

    async (req,res)=>{
        try{
            const errors= validationResult(req);
          if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
          }  

        const query = util.promisify(connection.query).bind(connection);
        const user = await query("select * from users where Email = ?"
        ,[req.body.Email]
        );
        
        if (user.length == 0) {
           return res.status(404).json({
                errors: [
                    {
                        msg: "email  not found !",
                    },
                ],
            });
        }
        const checkPassword =await bcrypt.compare(
            req.body.password,
            user[0].password
            );
        
        if(checkPassword){
            delete user[0].password;
            user.map((Suser)=>{
                Suser.image= "http://"+ req.hostname+ ":4000/"+Suser.image;
        
            });
            res.status(200).json(user[0]);
        }
        else
        {
                res.status(404).json({
                    errors:[
                        {   
                            msg:"email or  password incorect !"
                        }
                    ]

                });
        }
    }
    catch(err){
        res.status(500).json({err:err});
    }
});


//regsiter 
router.post(
    "/register",
    upload.single("image"),
    body("Name").isString().withMessage("please  enter valid name").isLength({min:3 ,max:20}).withMessage("enter  name  btween  3 and  20 charcter"),
    body("Email").isEmail().withMessage("please  enter valid email"),
    body("password").isLength({min:4 ,max:26}).withMessage("enter  password  btween  4 and  26 charcter"),
    body("phone").isInt().isLength({man:10, max:12}).withMessage("Please Enter a Valid Phone number"),
    body("type").isIn(['bidder', 'seller']).withMessage('Please choose a valid user type'),

    async (req,res)=>{
        try{
            
            const errors= validationResult(req);
            const query = util.promisify(connection.query).bind(connection);
            const checkEmailExists = await query("select * from users where Email = ?"
            ,[req.body.Email]
            );
            const checkphoneExists = await query("select * from users where phone = ?"
            ,[req.body.phone]
            );
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

        
        else if (checkEmailExists.length > 0) {
            res.status(200).json({
                errors: [
                    {
                        msg: "email already exist !",
                    },
                ],
            });
            fs.unlinkSync("./Assets/userImage/"+req.file.filename);

        }
        else if (checkphoneExists.length > 0) {
            res.status(200).json({
                errors: [
                    {
                        msg: "phone already used !",
                    },
                ],
            });
            fs.unlinkSync("./Assets/userImage/"+req.file.filename);

        }
        else{
            const userData={
                Name: req.body.Name,
                Email:req.body.Email,
                image:req.file.filename,
                password:await bcrypt.hash(req.body.password,10),
                token:crypto.randomBytes(16).toString("hex"),
                phone:req.body.phone,
                type:req.body.type,
            };
            await query("insert into users set ? ",userData);
            delete userData.password;
            userData.image="http://"+ req.hostname+ ":4000/"+userData.image;
            userData.status="Inactive";
            res.status(200).json(userData);
        }
    }
    catch(err){
        res.status(500).json({err:err});
    }
});



//update
router.post(
    "/update",
    authoized,
    upload.single("image"),
    body("Name"),
    body("Email"),
    body("password"),
    body("phone"),
    body("type"),

    async (req,res)=>{
        try{
            
            const errors= validationResult(req);
            const query = util.promisify(connection.query).bind(connection);
            const checkEmailExists = await query("select * from users where Email = ?"
            ,[req.body.Email]
            );
            const checkphoneExists = await query("select * from users where phone = ?"
            ,[req.body.phone]
            );

          if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
          }  
         

          if (req.file) {
            // Construct the path to the user's image file
            const imagePath = "./Assets/userImage/" + res.locals.user.image;
        
            // Check if the file exists before trying to delete it
            if (fs.existsSync(imagePath)) {
                try {
                    // Try to delete the file
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    // If there's an error, log it and continue
                    console.error(`Error deleting user image file: ${err}`);
                }
            }
        }

       
            const userData={
                Name: req.body.Name? req.body.Name : res.locals.user.Name ,
                Email:req.body.Email? req.body.Email : res.locals.user.Email,
                image:req.file? req.file.filename : res.locals.user.image,
                password: req.body.password?await bcrypt.hash(req.body.password,10):res.locals.user.password,
                phone:req.body.phone?req.body.phone:res.locals.user.phone,
                type:req.body.type?req.body.type:res.locals.user.type,
               
            };
 

            console.log(userData);
           
            await query("update  users set ? where ID = ? ",[userData,res.locals.user.ID]);
            delete userData.password;
            userData.image="http://"+ req.hostname+ ":4000/"+userData.image;
            userData.status=res.locals.user.status;
            userData.token=res.locals.user.token;
            res.status(200).json(userData);
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({err:err});
    }
});
module.exports=router;