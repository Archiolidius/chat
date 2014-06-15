/**
 * Created by alex on 14.06.2014.
 */
$(document).ready(function () {
    var socket,
        clientsCount;
    var chat = {
        init: function () {
            this.getUserName();
            this.socket();
            this.bind();
        },

        getUserName: function () {
            $('#newUser').modal('show');
        },

        sendNickname: function (event) {
            var nickName = $('#nickname').val();
            if (nickName && (nickName !== '')) {
                socket.send('Nickname: ' + nickName)
            }
            $('#newUser').modal('hide');
            return false;
        },

        showMessage: function (messageText, type, nickname) {
            if (type == 'systemMessage') {
                var messageItem = '<div><h5 class="systemMessage">' + messageText + '</h5></div>';
                $('#subshribe').append(messageItem);
            } else if (type == 'userMessage') {
                var messageItem = '<div class="subshribeItem"><strong class="nickname">' + nickname + '</strong>:<p class="messageText">' + messageText + '</p></div>';
                $('#subshribe').append(messageItem);
            }
        },

        clientsCount: function(clientsCount){
            $('.clientsCount span').text(clientsCount);
        },
        socket: function () {
            var that = this;

            socket = new WebSocket("ws://localhost:8081");

            //incoming message
            socket.onmessage = function (event) {
                var obj = JSON.parse(event.data);
                that.clientsCount(obj.clientsCount);
                that.showMessage(obj.text, obj.type, obj.nickname);
            };

            //close connection
            socket.onclose = function (event) {
                if (event.code === 1000) {
                    console.log('Нормальное закрытие.');
                } else if (event.code === 1001) {
                    console.log('Удалённая сторона «исчезла».');
                } else if (event.code === 1000) {
                    console.log('Удалённая сторона завершила соединение в связи с ошибкой протокола.');
                } else if (event.code === 1000) {
                    console.log('Удалённая сторона завершила соединение в связи с тем, что она получила данные, которые не может принять.');
                }
            };
            //show message
        },

        bind: function () {
            $('.sendNickname').on('click', this.sendNickname);
            $('#nicknameForm').on('submit', this.sendNickname);

            //send message
            document.forms.publish.onsubmit = function () {
                var submitMessage = this.message.value;
                socket.send(submitMessage);
                this.message.value = '';
                return false;
            };
        }
    };

    chat.init();
});