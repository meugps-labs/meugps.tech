#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h" // Inclui o arquivo de configurações

// --- Variáveis Globais ---
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
const int MSG_PUBLISH_INTERVAL = 30000; // Intervalo de heartbeat (30 segundos)
unsigned long lastReconnectAttempt = 0;
const unsigned long RECONNECT_INTERVAL = 5000; // tenta reconectar a cada 5s de forma não-bloqueante

// LED_PIN is defined in config.h as a macro

// Níveis lógicos para ligar/desligar, definidos a partir de config.h
const int ON_LEVEL = (LED_ACTIVE_LOW ? LOW : HIGH);
const int OFF_LEVEL = (LED_ACTIVE_LOW ? HIGH : LOW);

// --- Funções ---

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if(retries++ > 20) {
      Serial.println("\nFalha ao conectar. Reiniciando em 5 segundos...");
      delay(5000);
      ESP.restart();
    }
  }

  Serial.println("\nWiFi conectado!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida no tópico: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (strcmp(topic, MQTT_TOPIC_LED_COMMAND) == 0) {
    if (message == "1") {
      digitalWrite(LED_PIN, ON_LEVEL);
      Serial.println("LED Ligado (aplicando nível ON)");
      client.publish(MQTT_TOPIC_HARDWARE_STATUS, "LED ON", true);
      // publica também o nível lógico do pino para debug
      char buf[16];
      sprintf(buf, "pin=%d", ON_LEVEL);
      client.publish(MQTT_TOPIC_HARDWARE_STATUS, buf, true);
    } else if (message == "0") {
      digitalWrite(LED_PIN, OFF_LEVEL);
      Serial.println("LED Desligado (aplicando nível OFF)");
      client.publish(MQTT_TOPIC_HARDWARE_STATUS, "LED OFF", true);
      char buf[16];
      sprintf(buf, "pin=%d", OFF_LEVEL);
      client.publish(MQTT_TOPIC_HARDWARE_STATUS, buf, true);
    }
  }
}

// Tenta reconectar uma vez (não-bloqueante). Retorna true se conectado.
bool tryReconnect() {
  if (client.connected()) return true;

  Serial.print("Tentando conectar ao Broker MQTT...");
  String clientId = "ESP32_MeuGPS_";
  clientId += String(random(0xffff), HEX);

  if (client.connect(clientId.c_str())) {
    Serial.println("Conectado!");
    client.publish(MQTT_TOPIC_HARDWARE_STATUS, "online", true);
    client.subscribe(MQTT_TOPIC_LED_COMMAND);
    Serial.print("Subscrito ao tópico: ");
    Serial.println(MQTT_TOPIC_LED_COMMAND);
    return true;
  } else {
    Serial.print("Falhou, rc=");
    Serial.print(client.state());
    Serial.println(" Tentando novamente mais tarde");
    return false;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, OFF_LEVEL); // Garante que o LED comece desligado (respeita active-low)
  
  setup_wifi();
  
  client.setServer(MQTT_BROKER, MQTT_PORT);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    unsigned long now = millis();
    if (now - lastReconnectAttempt > RECONNECT_INTERVAL) {
      lastReconnectAttempt = now;
      tryReconnect();
    }
  }

  client.loop();

  // Envia um "heartbeat" periodicamente
  unsigned long now = millis();
  if (now - lastMsg > MSG_PUBLISH_INTERVAL) {
    lastMsg = now;
    if (client.connected()) {
      client.publish(MQTT_TOPIC_HARDWARE_STATUS, "alive", true);
      Serial.println("Heartbeat enviado.");
    }
  }
}