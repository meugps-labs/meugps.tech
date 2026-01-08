const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configurar Socket.io com CORS para produção
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3001", "https://meugps.tech", "http://meugps.tech"],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['polling', 'websocket']
});

// MQTT - Configuração para broker remoto
// Usando broker público do Mosquitto como padrão
// Pode ser sobrescrito via variável de ambiente MQTT_BROKER_URL
const mqttBroker = process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com';

// Formata o texto do broker para exibição no frontend (remove protocolo, mantém host:port)
function formatBrokerDisplay(broker) {
    try {
        const url = new URL(broker);
        return url.hostname + (url.port ? `:${url.port}` : '');
    } catch (e) {
        return broker.replace(/^.*:\/\//, '');
    }
}
// Configurações de conexão MQTT otimizadas para broker remoto
const mqttOptions = {
    clientId: `meugps_server_${Math.random().toString(16).substr(2, 8)}`,
    connectTimeout: 10000, // 10 segundos timeout
    reconnectPeriod: 1000, // Reconectar a cada 1 segundo se perder conexão (mais responsivo)
    keepalive: 60,
    clean: true,
    rejectUnauthorized: false // Para brokers sem SSL válido
};

const mqttClient = mqtt.connect(mqttBroker, mqttOptions);

// Middleware para logs
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/prototipo.html'));
});

app.get('/prototipo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/prototipo.html'));
});

// Rota de saúde para verificar se o servidor está rodando
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        mqtt: mqttClient.connected,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Enviar status MQTT atual para o cliente recém-conetado
function sendMqttStatus(socket) {
    const status = {
        connected: mqttClient.connected,
        broker: formatBrokerDisplay(mqttBroker)
    };
    socket.emit('mqtt_status', status);
}

// MQTT eventos
mqttClient.on('connect', () => {
    console.log('✅ MQTT conectado ao broker remoto:', mqttBroker);
    console.log('🔗 Client ID:', mqttOptions.clientId);
    mqttClient.subscribe('meugps/v1/hardware/status', (err) => {
        if (err) {
            console.error('❌ Erro ao subscrever tópico:', err);
        } else {
            console.log('📡 Subscrito ao tópico: meugps/v1/hardware/status');
        }
    });
    io.emit('mqtt_status', { connected: true, broker: formatBrokerDisplay(mqttBroker) });
});

mqttClient.on('error', (err) => {
    console.error('❌ Erro MQTT:', err.message);
});

mqttClient.on('reconnect', () => {
    console.log('🔄 Tentando reconectar ao broker MQTT...');
    io.emit('mqtt_status', { connected: false, state: 'reconnecting', broker: formatBrokerDisplay(mqttBroker) });
});

mqttClient.on('disconnect', () => {
    console.log('⚠️  Desconectado do broker MQTT');
    io.emit('mqtt_status', { connected: false, state: 'disconnected', broker: formatBrokerDisplay(mqttBroker) });
});

mqttClient.on('offline', () => {
    console.log('📴 Cliente MQTT offline');
    io.emit('mqtt_status', { connected: false, state: 'offline', broker: formatBrokerDisplay(mqttBroker) });
});

mqttClient.on('message', (topic, message) => {
    console.log(`MQTT recebido: ${message.toString()}`);
    io.emit('update_status', { msg: `Hardware: ${message.toString()}` });
});

// Socket.io eventos
io.on('connection', (socket) => {
    console.log('👤 Cliente conectado:', socket.id);

    // Envia o status inicial do MQTT para o cliente que acabou de conectar
    sendMqttStatus(socket);

    socket.on('led_control', (data) => {
        const payload = data.status === 'ON' ? "1" : "0";
        console.log(`LED: ${data.status} (payload: ${payload})`);
        
        if (mqttClient.connected) {
            mqttClient.publish('meugps/v1/hardware/led', payload);
            socket.emit('update_status', { msg: `LED ${data.status} - Enviado` });
        } else {
            socket.emit('update_status', { msg: `Erro: MQTT desconectado` });
        }
    });

    socket.on('disconnect', () => {
        console.log('👤 Cliente desconectado:', socket.id);
    });

    // Enviar status inicial do WebSocket
    socket.emit('update_status', { 
        msg: `Conectado ao servidor! Aguardando status do MQTT...` 
    });
});

// Tratamento de erros
io.on('error', (err) => {
    console.error('❌ Erro Socket.io:', err);
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em: http://0.0.0.0:${PORT}`);
    console.log(`🔗 MQTT Broker Remoto: ${mqttBroker}`);
    console.log(`🆔 Client ID: ${mqttOptions.clientId}`);
    console.log(`📁 Arquivos estáticos: ${path.join(__dirname, '../public')}`);
    console.log(`⚙️  Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 Desligando servidor...');
    mqttClient.end();
    server.close(() => {
        console.log('✅ Servidor desligado');
        process.exit(0);
    });
});