import { Server } from "socket.io";
import  jwt  from "jsonwebtoken";
import auth from '../middleware/authenJWT';
import { createOrder } from "service/order";
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
          console.log(socket.auth)
          socket.auth = true;
          socket.emit('authenticate','Xác thực thành công')
      })
      });
      socket.on('createOrder',data=>{
        createOrder(data,socket).catch(err=>{console.log(err)})
      })
      setTimeout(()=>{
        console.log(socket.auth)
      },3000)
    })
}