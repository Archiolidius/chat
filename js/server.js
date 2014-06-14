/**
 * Created by alex on 14.06.2014.
 */
var http = require('http');
var WebSocketServer = new require('ws');

var clients = {};

var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function (ws) {
    var id = Math.random();
    clients[id] = ws;
    console.log('new connection. User: ' + id);

    ws.on('message', function (message) {
        console.log('new message: ' + message);

        for (var key in clients) {
            clients[key].send(message);
        }
    });

    ws.on('close', function () {
        console.log('Connection is close' + id);
        delete clients[id];
    })
});

console.log('Server run in port 8081')