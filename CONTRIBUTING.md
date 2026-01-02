# 🛠️ Guia de Contribuição - MeuGPS Labs

Bem-vindo ao time! Se você está lendo isso, você é um dos cofundadores da **MeuGPS Labs**. Nosso objetivo é transformar créditos de estudante em uma infraestrutura de elite e produtos reais.

Para manter a ordem na nossa "SoftHouse", siga estas diretrizes técnicas:

---

## 1. Configuração do Ambiente Local

Antes de tocar no código, prepare sua máquina:

1.  **Node.js:** Certifique-se de estar usando a versão 18 ou superior.
2.  **Git:** Configure seu usuário e e-mail:
    ```bash
    git config --global user.name "Seu Nome"
    git config --global user.email "seu-email@exemplo.com"
    ```
3.  **Clonagem:**
    ```bash
    git clone [https://github.com/meugps-labs/meugps.tech.git](https://github.com/meugps-labs/meugps.tech.git)
    cd meugps.tech
    npm install
    ```

---

## 2. Fluxo de Trabalho (Git Flow)

**Nunca de dê push direto na `main`**. A `main` é o nosso ambiente de produção sagrado.

1.  **Crie uma branch** para sua tarefa:
    `git checkout -b feature/nome-da-sua-task`
2.  **Trabalhe localmente** e teste no seu `localhost`.
3.  **Commit** com mensagens claras:
    `git commit -m "feat: adiciona integração com banco de dados"`
4.  **Suba sua branch** e abra um **Pull Request (PR)** no GitHub.
5.  O PR será revisado e, após aprovado, o **GitHub Actions** fará o deploy automático para a VM (Virtual Machine no Google Cloud nosso Ambiente de Produção).

---

## 3. Padrões de Código e Pastas

* **`public/`**: Apenas arquivos estáticos (HTML, CSS, Imagens). O Nginx serve esta pasta diretamente.
* **`src/`**: Lógica do Backend Node.js.
* **Variáveis de Ambiente**: Nunca suba arquivos `.env` ou senhas para o GitHub. Use o arquivo `.env.example` como base.

---

## 4. Acesso aos Servidores (SSH)

Como somos uma empresa focada em **Linux**, o acesso será via terminal:

* Se você faz parte da **Squad Infra**, você receberá uma chave pública para acessar a instância no GCP ou Azure.
* **Regra de Ouro:** Antes de alterar qualquer arquivo na VM, faça um backup: `cp arquivo.js arquivo.js.bak`.

---

## 5. Ativação de Créditos (Aceleradora)

Para que o projeto escale, cada membro deve ativar seus benefícios:
* [GitHub Student Pack](https://education.github.com/pack)
* Resgate os **$100 da Azure** e **$200 da DigitalOcean**.
* Comunique ao líder da Squad Infra quando seus créditos estiverem ativos para planejarmos a expansão dos subdomínios.

---

## 🚀 Ética de Trabalho
Somos uma SoftHouse nascida na faculdade, mas com postura de **Big Tech**. Errar faz parte, mas esconder o erro é proibido. Se quebrou o código, peça ajuda e vamos consertar juntos!

**Bora buildar!**