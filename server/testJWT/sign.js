import JWT  from "jsonwebtoken"; 
import dotenv from "dotenv";
dotenv.config();
// const secretKey= "member";
// const secretKey=process.argv[2];
const secretKey= process.env.JWT_SECRET_KEY;

const token=JWT.sign({
    name:"pinchi",
    mail:"testmail@mail.com"
},secretKey)
console.log(token);
