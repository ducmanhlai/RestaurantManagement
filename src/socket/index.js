import { Server } from "socket.io";
export default function socket(server){
    const io = new Server(server, { /* options */ });
    io.on("connection", (socket) => {
        console.log(socket.id)
      });
}