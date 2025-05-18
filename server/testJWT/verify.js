import JWT  from "jsonwebtoken"; 
// const secretKey= "member";
const secretKey=process.argv[2];

const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGluY2hpIiwibWFpbCI6InRlc3RtYWlsQG1haWwuY29tIiwiaWF0IjoxNzQ3MTA3NTI0fQ.W37dqxsDiUOykNdC1kKMPYyf3veCa2avK8m14u7yWfM";

JWT.verify(token,secretKey,(err,user)=>{
    if(err) return console.log(err);
    console.log(user);
})
