var socketioJwt   = require("socketio-jwt");

var clients = {};

module.exports = function(io) {
    io.sockets.on('connection', socketioJwt.authorize({
        secret: 'supersecret', 
        timeout: 15000 // 15s
    })).on('authenticated', function(socket) {
        console.log(socket.decoded_token.user + ' connected using ' + socket.decoded_token.device);

        var room = socket.decoded_token.room;
        var device = socket.decoded_token.device;
        var unique = socket.decoded_token.iat;

        if (!clients[room]) {
            clients[room] = {};
        }

        clients[room][unique] = device;

        // Route notifications to clients who are listening
        socket.on(room + '-notifications', function(notif) {
            notif['device'] = device;
            io.emit(room + '-notifications', notif);
        });

        // Report all known connected devices
        socket.on(room + '-devices', function(msg) {
            var devices = [];
            for (const key of Object.keys(clients[room])) {
                const val = clients[room][key];
                devices.push(val);
            }
            socket.emit(room + '-devices', devices);
        });

        socket.on('disconnect', function(socket) {
            delete clients[room][unique];
        });
    });
}