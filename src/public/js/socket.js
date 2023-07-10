import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
socket.on('connect', function(){
  socket.emit('authenticate', {token:localStorage.getItem('accessToken')});
});
  
  socket.on("disconnect", () => {
    console.log(socket.id); 
});
export default socket