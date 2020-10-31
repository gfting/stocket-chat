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

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user disconnected')
    });

    socket.on('chat message', (msg) => {
        console.log(`Nickname: ${msg.nickname}`)
        console.log(`Message: ${msg.message}`)
        io.emit('chat message', msg);
        const tickerQueries = findTickerSymbols(msg.message)
        
        if (tickerQueries.length > 0 && tickerData[tickerQueries[0]]) {
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