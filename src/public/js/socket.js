import socketIoClient from 'https://cdn.jsdelivr.net/npm/socket.io-client@4.7.0/+esm'
const socket =socketIoClient()
// client-side
socket.on("connect", () => {
    console.log(socket.id); 
  });
  
  socket.on("disconnect", () => {
    console.log(socket.id); 
});
export default socket