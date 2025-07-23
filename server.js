const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');


const Message = require('./models/message'); 
const app = express();

const server = http.createServer(app);


const io = socketIo(server); 

const MONGO_URL = "mongodb+srv://premrinkinoniya:d63ggvm1TnlBGSBn@cluster0.2aziny6.mongodb.net/chatApp?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL).then(() => {
    console.log('MongoDB is connected successfully');
}).catch(err => {
    console.error('Mongo connection error:', err); 
})


app.use(express.static(__dirname + '/public')); 


io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    
    Message.find().sort({ timestamp: 1 }).then(messages => {
        socket.emit('load old messages', messages);
    }).catch(err => {
        console.error('Error fetching messages:', err);
    })

    socket.on('chat message', (data) => {
        const newMessage = new Message({
            sender: data.sender,
            message: data.message
        });

        newMessage.save().then(() => {
            io.emit('chat message', data)
        }).catch(err => {
            console.error('Error saving message:', err); 
        })
    })


    socket.on('disconnect', () => {
        console.log("A user disconnected:", socket.id); 
    })
})

const PORT = process.env.PORT || 2000;


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})