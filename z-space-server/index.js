const TAG = "[index.js]";

const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');
const HandleEvent = require('./src/socket/HandleEvent');

const port = 8100;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin:'*',
        methods:['GET', 'POST']
    }
});


/**
 * initialize socket.io server
 */
const handler = new HandleEvent(io);


/**
 * initialize express server
 */
app.get('/', (req, res) => {
    res.send('<h3>build.2923.1101.1112</h3>');
});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});

