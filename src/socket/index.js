import { Server } from "socket.io";
import  jwt  from "jsonwebtoken";
import auth from '../middleware/authenJWT'
export default function socket(server){
    const io = new Server(server);
    io.on('connection', function(socket){
      socket.auth = false;
      socket.on('authenticate', function(data){
        jwt.verify(data.token, process.env.ACCESS_KEY, (err, data) => {
          if (err) {
              console.log(err);
              socket.emit("err",err)
          }
          socket.auth = true;
      })
      
      });
      setTimeout(()=>{
        console.log(socket.auth)
      },3000)
    })
}