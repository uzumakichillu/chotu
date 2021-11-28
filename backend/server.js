import express from "express"
import cors from "cors"
import router from "./api/urls.route.js"
import io from "socket.io"
import http from "http"


const app = express()

const httpServer = http.createServer(app);
const io1 = new io(httpServer, {origin:':*'})

let socketList = {};

app.use(cors())
app.use(express.json())
app.use("/api",router)
app.use("*", (req,res)=>{
    console.log("not working- url not found --> "+ req.url)
    res.status(404).json({error:'Not found'})
})


// Socket
io1.on('connection', (socket) => {
    console.log(`New User connected: ${socket.id}`);
  
    //user leaves the meet
    socket.on('disconnect', () => {
      socket.disconnect();
      console.log('User disconnected!');
    });
  
    //check user wit roomId and name
    socket.on('BE-check-user', async ({ roomId, userName }) => {
      let error = false;
       io1.sockets.in(roomId).clients((err, clients) => {
        
        clients.forEach((client) => {
          if (socketList[client] == userName) {
            error = true;
          }
        });
        socket.emit('FE-error-user-exist', { error });
       });
    });
  
    /**
     * Join Room
     */
    socket.on('BE-join-room', ({ roomId, userName }) => {
      // Socket Join RoomName
      socket.join(roomId);
      socketList[socket.id] = { userName, video: true, audio: true };
  
      // Set User List
      io1.sockets.in(roomId).clients((err, clients) => {
        try {
          const users = [];
          clients.forEach((client) => {
            // Add User List
            users.push({ userId: client, info: socketList[client] });
          });
          socket.broadcast.to(roomId).emit('FE-user-join', users);
          // io.sockets.in(roomId).emit('FE-user-join', users);
        } catch (e) {
          io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
        }
      });
    });
    
    //call user
    socket.on('BE-call-user', ({ userToCall, from, signal }) => {
      io1.to(userToCall).emit('FE-receive-call', {
        signal,
        from,
        info: socketList[socket.id],
      });
    });
    
    //user accepts the call
    socket.on('BE-accept-call', ({ signal, to }) => {
      io1.to(to).emit('FE-call-accepted', {
        signal,
        answerId: socket.id,
      });
    });
  
    //user has sent the message in the room with roomId
    socket.on('BE-send-message', ({ roomId, msg, sender }) => {
      io1.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
    });
    
    //user has left the room with roomId
    socket.on('BE-leave-room', ({ roomId, leaver }) => {
      delete socketList[socket.id];
      socket.broadcast
        .to(roomId)
        .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
      io1.sockets.sockets[socket.id].leave(roomId);
    });
  
    //user toggle camera / audio icon
    socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
      if (switchTarget === 'video') {
        socketList[socket.id].video = !socketList[socket.id].video;
      } else {
        socketList[socket.id].audio = !socketList[socket.id].audio;
      }
      socket.broadcast
        .to(roomId)
        .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
    });
  });




export default httpServer

