const connection =require("../DB/dbConnection");
const util = require("util");

const authoized = async(req, res ,next) =>{

    const query = util.promisify(connection.query).bind(connection);
    const {token} =req.headers;
    const user=await query("select * from users where token =?",[token]);
   
   if(user[0]){
    res.locals.user=user[0];
    next();
   }else{
    res.status(403).json({
        
        msg: "you are not have acess to this route",
    });
    
}
};
module.exports= authoized;