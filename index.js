const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Finds values between $ $
function findTickerSymbols(text) {
    const regex = /(?<=\$)(.*?)(?=\$)/;
    return regex.exec(text)
}

const tickerData = {
    AAPL: 120.93,
    AMZN: 1300.00
}

// Make a mock database of users
const users = {}

const socketsToUsers = {}

io.on('connection', (socket) => {
    // console.log(socket.id)
    console.log('a user connected');

    io.emit('user connected')

    socket.on('disconnect', () => {
        if (socket.id in socketsToUsers) {
            console.log('user disconnected');
            console.log(socketsToUsers[socket.id])
            io.emit('user disconnected', `${socketsToUsers[socket.id]}`)
        } else {
            console.log('user disconnected');
            io.emit('user disconnected', 'A user')
        }
    });

    socket.on('chat message', (msg) => {

        // Uses @ as a flag for a private message
        if (msg.message[0] === "@") {
            const msgArr = msg.message.split(' ')
            const username = msgArr[0].substr(1, msgArr[0].length - 1)
            // Checks if exists in DB, sends it as a private message
            if (username in users) {
                io.to(users[username]).emit('private message', msg);

                // Send it back to itself
                // TODO: This is hacky, needs to be refactored if actual project 
                io.to(socket.id).emit('private message', msg)
            } else {
                const errorObject = {nickname: msg.nickname, message: `${username} is not a valid username.`}
                io.to(socket.id).emit('private message', errorObject)
            }
            return;
        }

        // Capture and store nickname
        console.log(`Nickname: ${msg.nickname}`)
        users[msg.nickname] = socket.id

        socketsToUsers[socket.id] = msg.nickname

        console.log(`Message: ${msg.message}`)
        io.emit('chat message', msg);

        // Handle ticker logic
        const tickerQueries = findTickerSymbols(msg.message)
        
        if (tickerQueries > 0 && tickerData[tickerQueries[0]]) {
            const symbol = tickerQueries[0]
            console.log(`Symbol: ${symbol}, Price: ${tickerData[symbol]}`)
            io.emit('ticker data', {symbol: symbol, price: tickerData[symbol]})
        }
    });
});

// Start the server on port 3000
server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});