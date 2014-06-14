var socket = new WebSocket("ws://localhost:8081");

//send message
document.forms.publish.onsubmit = function () {
    var submitMessage = this.message.value;
    socket.send(submitMessage);
    return false;
};

//incoming message
socket.onmessage = function (event) {
    var incomingMessage = event.data;
    showMessage(incomingMessage);
};

//show message
function showMessage(messageText) {
    var messageItem = document.createElement('div');
    messageItem.appendChild(document.createTextNode(messageText));
    document.getElementById('subshribe').appendChild(messageItem);
}