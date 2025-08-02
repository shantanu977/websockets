import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors"

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server,{
    cors :{
        origin : "http://localhost:5173",
        methods :["GET","POST"],
        credentials : true
    }
});


io.on("connection",function(socket){

    console.log("User Connected : ",socket.id);


    socket.on("message",function({message,toUser}){
        //console.log(data);
        socket.to(toUser).emit("recieved",({from : socket.id, msg : message}));
    })

    socket.on("disconnect",function(){
        console.log(socket.id," Disconnected");
    })

    socket.on("setroom",function(room){
        socket.join(room);
    })
    socket.on("room-message", function({ room, msg }) {
    socket.to(room).emit("recieved", { from: socket.id, msg });
        });

})


app.get("/",function(req,res){
    res.send("Hiiii");
})

server.listen(3000,function(){
    console.log("Runnning on port 3000")
});