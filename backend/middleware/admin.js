// const connection =require("../DB/dbConnection");
// const util = require("util");

// const admin = async(req, res ,next) =>{

//     const query = util.promisify(connection.query).bind(connection);
//     const {token} =req.headers;
//     const adminData=await query("select * from `users` where token =?", [token]);

//    if(adminData[0]&&adminData[0].type=="admin"){
//     next();


//    }else{
//     res.status(403).json({
        
//         errors:[
//             {   
//                 msg: "you are not have acess to this route",

//             },
//         ],
//     });
// }
// };
// module.exports= admin;



const connection =require("../DB/dbConnection");
const util = require("util");

const admin = async(req, res ,next) =>{

    const query = util.promisify(connection.query).bind(connection);
    const {token} =req.headers;
    const adminData=await query("select * from users where token =?",[token]);
   console.log(adminData)
   if(adminData[0] && adminData[0].type=="admin"){
    next();
   }else{
    res.status(400).json({
        errors:[
            {   
                msg: "you are not have acess to this route",

            },
        ],

    });
    
}
};
module.exports= admin;