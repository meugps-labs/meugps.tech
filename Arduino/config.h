// Arquivo de Configuração para o Firmware do ESP32

#ifndef CONFIG_H
#define CONFIG_H

// --- Configurações de Wi-Fi ---
// Coloque aqui o nome (SSID) e a senha da sua rede Wi-Fi
const char* WIFI_SSID = "SUA_REDE_WIFI";
const char* WIFI_PASSWORD = "SUA_SENHA_WIFI";

// --- Configurações do Broker MQTT ---
// Endereço do seu broker MQTT. 
// Se estiver rodando o servidor localmente na mesma rede, pode ser o IP da sua máquina.
// Se estiver usando um broker público como o test.mosquitto.org, use o endereço dele.
const char* MQTT_BROKER = "broker.hivemq.com";
const int MQTT_PORT = 1883; // Porta padrão para MQTT não criptografado

// --- Tópicos MQTT ---
// Tópico para receber comandos de controle do LED
const char* MQTT_TOPIC_LED_COMMAND = "meugps/v1/hardware/led";
// Tópico para publicar o status do hardware (online, status do LED, etc.)
const char* MQTT_TOPIC_HARDWARE_STATUS = "meugps/v1/hardware/status";

// Definição do pino do LED (use macro para facilitar substituições em tempo de compilação)
#define LED_PIN 2

// Hardware note: some ESP32 boards expose the on-board LED as ACTIVE LOW.
// If your LED lights when the pin is LOW, set this to true. Default: false.
const bool LED_ACTIVE_LOW = false;

#endif // CONFIG_H
