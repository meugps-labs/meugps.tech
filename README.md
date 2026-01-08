# 📍 MeuGPS.tech

![Status do Deploy](https://img.shields.io/github/actions/workflow/status/reltonlima/meugps.tech/main.yml?branch=main&style=flat-square)
![Licença](https://img.shields.io/github/license/reltonlima/meugps.tech?style=flat-square)

O **MeuGPS.tech** é um projeto open-source que combina um site institucional com um protótipo IoT de controle remoto via MQTT. Ele inclui:
- um frontend simples (`public/prototipo.html`) que controla um LED em um ESP32 via WebSocket;
- um backend Node.js que faz ponte entre WebSocket e um broker MQTT (atualmente configurado para `broker.hivemq.com` por padrão);
- firmware Arduino para ESP32 que subscreve/comunica através de tópicos MQTT.

## 🚀 Tecnologias

- Frontend: HTML + Tailwind CSS
- Backend: Node.js + Socket.IO + mqtt (cliente)
- Device: ESP32 com biblioteca `PubSubClient`

---

## 🧪 Tutorial rápido — rodando o protótipo localmente

Esses passos cobrem o fluxo end-to-end (backend + frontend + firmware).

### 1) Requisitos

- Node.js (v18+ recomendado)
- Arduino IDE ou PlatformIO para compilar e gravar o firmware no ESP32
- Acesso à sua rede Wi‑Fi para conectar o ESP32
- MQTT Explorer (opcional) para visualizar tópicos

### 2) Preparar o backend

1. Clone o repositório e instale dependências:

```bash
git clone https://github.com/meugps-labs/meugps.tech.git
cd meugps.tech
npm install
```

2. Configurar broker MQTT (opcional):

- Por padrão o backend usa `mqtt://broker.hivemq.com`. Para usar outro broker, exporte a variável de ambiente antes de iniciar:

```bash
export MQTT_BROKER_URL="mqtt://seu-broker:1883"
# no Windows PowerShell:
$env:MQTT_BROKER_URL = 'mqtt://seu-broker:1883'
```

3. Iniciar o servidor:

```bash
node src/esp32mqtt-server.js
```

O servidor serve o frontend em `http://localhost:3001` por padrão.

### 3) Preparar e flashar o firmware do ESP32

1. Abra `Arduino/config.h` e preencha suas credenciais Wi‑Fi (`WIFI_SSID`, `WIFI_PASSWORD`).
2. Confirme `LED_PIN` e `LED_ACTIVE_LOW` conforme sua placa. Por exemplo:

```c
// config.h
#define LED_PIN 2
const bool LED_ACTIVE_LOW = false; // true se LED acende com nível LOW
```

3. Compile e grave `Arduino/Firmware.ino` no ESP32.

O firmware:
- conecta ao broker MQTT (atual padrão `broker.hivemq.com`);
- subscreve `meugps/v1/hardware/led` (comandos `1`/`0`);
- publica status em `meugps/v1/hardware/status` (mensagens retidas: `online`, `LED ON`, `LED OFF`, `pin=...`, `alive`).

### 4) Abrir o frontend

Abra no navegador:

- `http://localhost:3001` ou `http://localhost:3001/prototipo`

O frontend conecta via WebSocket ao backend e mostra o estado do broker e do LED.

### 5) Testes e diagnóstico

- Use o MQTT Explorer para inspecionar os tópicos:
	- `meugps/v1/hardware/led` — publice `1` ou `0` para testar.
	- `meugps/v1/hardware/status` — verifique mensagens retidas (retained) para sincronizar estado.

- Passos comuns de verificação:
	1. Reinicie o ESP32: o firmware publica `online` (retained) e o frontend deve sincronizar para `OFF` automaticamente.
	2. Publique `1` no tópico `meugps/v1/hardware/led`: ESP deve ligar o LED e publicar `LED ON` (retained).
	3. No frontend, ao receber `LED ON`/`LED OFF`, o switch é atualizado.

### 6) Resolução de problemas

- LED não acende apesar de comando recebido:
	- Verifique `LED_PIN` correto em `config.h`.
	- Algumas placas usam LED ativo em nível baixo (active‑low). Ajuste `LED_ACTIVE_LOW = true` se necessário.
	- Teste com um LED externo e resistor no pino configurado.
	- Verifique o Serial Monitor (115200) para ver mensagens e payloads.

- Frontend não sincroniza ao reiniciar o ESP:
	- O firmware publica mensagens com `retain = true`. O backend subscreve ao tópico e repassa eventos via WebSocket. Se o frontend não atualizar, recarregue a página e verifique que o servidor Node esteja recebendo a mensagem retida (veja logs).

---

## 🧩 Arquitetura resumida

- ESP32 ↔ (MQTT broker) ↔ Backend Node.js ↔ (Socket.IO) ↔ Frontend

O backend atua como um *bridge*: recebe mensagens MQTT do ESP32 e emite eventos via Socket.IO para os navegadores; também publica comandos recebidos do frontend para o broker.

---

## 🤝 Como contribuir

1. Faça um Fork do repositório.
2. Crie uma branch para sua feature:

```bash
git checkout -b feature/minha-melhoria
```

3. Commit e push:

```bash
git commit -am "feat: descrição"
git push origin feature/minha-melhoria
```

4. Abra um Pull Request.

Ideias: documentação de deploy no GCP, painel de logs em tempo real, suporte OTA para firmware.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja LICENSE para mais informações.

Desenvolvido por Relton Lima 🚀
