const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data); // Sadece diğer istemcilere gönder
        console.log(`Mesaj alındı: ${data.text}`);
    });


    socket.on('disconnect', () => {
        console.log('Bir kullanıcı bağlantıyı kesti:', socket.id);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
