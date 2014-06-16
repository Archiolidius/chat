/**
 * Created by alex on 14.06.2014.
 */
$(document).ready(function () {
    var socket,
        clientsCount,
        messageField = $('textarea[name="message"]');

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

        sendMessage: function (message) {
            socket.send(message);
        },

        getDate: function () {
            var date = new Date();
            var curTime = {};
            curTime.hours = date.getHours();
            curTime.minutes = date.getMinutes();
            curTime.second = date.getSeconds();
            var dateString = (function () {
                var str = '';
                for (var key in curTime) {
                    str += curTime[key] += ':';
                }
                return str.substring(0, str.length - 1);
            })();
            return dateString;
        },

        showMessage: function (messageText, type, nickname) {
            if (type == 'systemMessage') {
                var messageItem = '<div><h5 class="systemMessage">' + messageText + '</h5></div>';
                $('#subshribe').append(messageItem);
            } else if (type == 'userMessage') {
                var messageItem = '<li class="subshribeItem"><strong class="nickname">' + nickname + '</strong><span class="massageDate pull-right"><span class="glyphicon glyphicon-time"></span>  ' + this.getDate() + '</span><p class="messageText">' + messageText + '</p></li>';
                $('#subshribe').append(messageItem);
            }

            $('#subshribe').perfectScrollbar('update');
            $("#subshribe").animate({ scrollTop: $('#subshribe')[0].scrollHeight}, 500);
        },

        clientsCount: function (clientsCount) {
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
        smiles: function () {
            $('.choose_smile').popover({
                html: ' '
            });
            $('body').on('click', '.smiles-popover .smile', function () {
                var smile = $(this).data('smile');
                var smileHtml = '<span class="smile" data-smile="' + smile + '"></span>'
                messageField.val(messageField.val() + smileHtml)
            })
        },

        bind: function () {
            var that = this;
            $('.sendNickname').on('click', this.sendNickname);
            $('#nicknameForm').on('submit', this.sendNickname);

            //send message
            document.forms.publish.onsubmit = function () {
                that.sendMessage(this.message.value);
                this.message.value = '';
                return false;
            };

            document.forms.publish.message.onkeyup = function (e) {
                if (e.keyCode == 13) {
                    if (e.shiftKey === true) {
                        //if Shift+Enter = new line
                    }
                    else {
                        that.sendMessage(this.value);
                        this.value = '';
                    }
                    return false;
                }
            };

            this.smiles();
            $('#subshribe').perfectScrollbar();
        }
    };

    chat.init();
});