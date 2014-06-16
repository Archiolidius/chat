/**
 * Created by alex on 14.06.2014.
 */
var http = require('http');
var WebSocketServer = new require('ws');

var clients = {};

var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function (ws) {
    var nickName;
    ws.on('message', function (message) {
        if (message.split(':')[0] === 'Nickname') {
            nickName = message.split(':')[1];
            clients[nickName] = ws;
            console.log('New user: ' + nickName);
            var clients_len = (function () {
                var i = 0;
                for (var key in clients) {
                    i++
                }
                return i;
            })();
            console.log(clients_len);
            var data = {
                text: 'User <strong>' + nickName + '</strong> has been connected to this chat',
                type: 'systemMessage',
                nickname: null,
                clientsCount: clients_len
            };
            for (var key in clients) {
                clients[key].send(JSON.stringify(data))
            }
        } else {
            console.log('new message: ' + message);
            for (var key in clients) {
                var data = {
                    text: message,
                    type: 'userMessage',
                    nickname: nickName
                };
                //ws.send(JSON.stringify(data))
                clients[key].send(JSON.stringify(data));
            }
        }
    });

    ws.on('close', function () {
        console.log('Connection is close' + nickName);
        delete clients[nickName];
        var clients_len = (function () {
            var i = 0;
            for (var key in clients) {
                i++
            }
            return i;
        })();
        var data = {
            text: 'User <strong>' + nickName + '</strong> leave from this chat',
            type: 'systemMessage',
            clientsCount: clients_len
        }
        for (var key in clients) {
            clients[key].send(JSON.stringify(data))
        }
    })
});

console.log('Server run in port 8081')