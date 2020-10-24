const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user disconnected')
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

// Start the server on port 3000
server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});