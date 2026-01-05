const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MQTT
const mqttClient = mqtt.connect('mqtt://localhost:1883');

// Servir arquivos estáticos da mesma pasta do servidor
app.use(express.static(__dirname));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'prototipo.html'));
});

app.get('/prototipo', (req, res) => {
    res.sendFile(path.join(__dirname, 'prototipo.html'));
});

// MQTT eventos
mqttClient.on('connect', () => {
    console.log('✅ MQTT conectado');
    mqttClient.subscribe('meugps/v1/hardware/status');
});

mqttClient.on('message', (topic, message) => {
    console.log(`MQTT recebido: ${message.toString()}`);
    io.emit('update_status', { msg: `Hardware: ${message.toString()}` });
});

// Socket.io eventos
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('led_control', (data) => {
        const payload = data.status === 'ON' ? "1" : "0";
        console.log(`LED: ${data.status}`);
        mqttClient.publish('meugps/v1/hardware/led', payload);
        socket.emit('update_status', { msg: `LED ${data.status}` });
    });
});

// Iniciar servidor
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
});