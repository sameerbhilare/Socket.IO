const http = require('http');
const websocket = require('ws');

// creating http server
const server = http.createServer((req, res) => {
  res.end('I am connected');
});

/* 
    create a websocket server
    Here 'server' {http.Server|https.Server} A pre-created Node.js HTTP/S server.
    With this websocket server will be created at the same port on which http 'server' is listening.
    But the wss will be accessed by ws:// protocol.
*/
const wss = new websocket.Server({ server });

/*
    'headers' event is emitted before the response headers are written to the socket as part of the handshake. 
    This allows you to inspect/modify the headers before they are sent.

    [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: RMTzlkUedGwqp/Gd7b/V7CwfuY4='
    ]

    When our http server receives a request with ws:// protocol in it,
    it switches the http protocol to ws and passes the request to websocket server for further handling.
    See above header which get printed on the 'headers' event.
*/
wss.on('headers', (headers, req) => {
  console.log(headers);
});

/*
    'connection' event is emitted when the handshake is complete. 
    request is the http GET request sent by the client. 
    Useful for parsing authority headers, cookie headers, and other information.
*/
wss.on('connection', (ws, req) => {
  ws.send('Welcome to the websocket server!!');

  ws.on('message', (msg) => {
    console.log(msg);
  });
});

server.listen(3000);
