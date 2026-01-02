# 🧭 Guia de Sobrevivência - MeuGPS Labs

Este guia é o seu manual de instruções para não ficar perdido na nossa infraestrutura e cultura. Se o servidor caiu, se você não sabe por onde começar ou se quer entender nossa stack, a resposta está aqui.

---

## 🚨 1. "Deu Ruim": O que fazer se o site cair?

Antes de entrar em pânico, siga estes passos:
1.  **Verifique o Status:** Tente acessar `https://api.meugps.tech/status`. Se o JSON carregar, o problema é no Frontend.
2.  **Logs do PM2:** Acesse a VM via SSH e digite:
    `pm2 logs` ou `pm2 monit`
    Isso mostrará os erros em tempo real no Node.js.
3.  **Reinicialização Segura:** Se o app travou:
    `pm2 restart meugps-app`
4.  **Nginx:** Se o erro for "502 Bad Gateway", o Node está desligado. Se for "404", o caminho da pasta `public` no Nginx pode estar errado.

---

## 🛠️ 2. Nossa Pilha de Ferramentas (Stack)

Para sobreviver aqui, você precisa se familiarizar com:
* **Acesso Remoto:** `SSH` e `SCP` (para transferir arquivos).
* **Editor na VM:** `nano` ou `vim` (para edições rápidas de emergência).
* **Gerenciador de Processos:** `PM2` (ele garante que o site não morra se o código der erro).
* **Servidor Web:** `Nginx` (ele é o porteiro que recebe as visitas e decide para onde enviá-las).
* **Banco de Dados:** `Supabase` (nossa camada de dados externa).

---

## 🔑 3. Gestão de "Secrets" (Segredos)

**Regra de Ouro:** NUNCA, em hipótese alguma, escreva uma senha, chave de API ou token diretamente no código que vai para o GitHub.
* Use o arquivo `.env` (como está no `.gitignore`).
* Se precisar de uma nova variável de ambiente no servidor, avise a **Squad Infra** para atualizarmos os Secrets do GitHub Actions.

---

## 📈 4. Como Crescer na MeuGPS Labs

Aqui, a hierarquia é baseada em **conhecimento e entrega**:
* **Junior:** Sabe abrir um Pull Request e corrigir bugs simples de HTML/CSS.
* **Pleno:** Domina a lógica do Backend e sabe criar rotas na API sem ajuda.
* **Senior:** Entende como o Nginx conversa com o Node, sabe configurar o SSL e resolve incidentes na VM via SSH.

---

## 🌍 5. O Ecossistema de Créditos

Nosso combustível são os créditos de estudante. 
* **Azure:** Usamos para serviços que exigem alta disponibilidade ou IA.
* **DigitalOcean:** Usamos para bancos de dados de teste e droplets rápidas.
* **GCP:** É a nossa casa principal (`meugps.tech`).

---

## 💬 6. Comunicação

1.  **WhatsApp:** Para alertas rápidos e avisos de "site fora do ar".
2.  **GitHub Issues/Projects:** Para organizar quem está fazendo o quê.
3.  **Code Review:** Seja educado ao revisar o código do colega. O objetivo é aprender, não criticar.

---

## 💡 7. Dica de Ouro do Analista Sênior

> "No Linux, tudo é um arquivo. Se você entender o arquivo de configuração, você domina o sistema. Antes de dar um comando com `sudo`, tenha certeza do que ele faz. O terminal não tem 'Lixeira' nem 'Ctrl+Z'."

---
**Vamos fazer história. 🚀**