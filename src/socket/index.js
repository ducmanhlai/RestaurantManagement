import { Server } from "socket.io";
import  jwt  from "jsonwebtoken";
import auth from '../middleware/authenJWT'
export default function socket(server){
    const io = new Server(server);
    io.on('connection', function(socket){
      socket.auth = false;
      socket.on('authenticate', function(data){
        // check data được send tới client
        jwt.verify(data.token, process.env.ACCESS_KEY, (err, data) => {
          if (err) {
              console.log(err);
              next(new Error("not authorized"));
          }
          socket.auth = true;
          console.log(socket.auth)
      })
      });
      setTimeout(()=>{
        console.log(socket.auth)
      },3000)
    })
}