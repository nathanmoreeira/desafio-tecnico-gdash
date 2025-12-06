# 🌦️ Desafio Técnico GDASH 2025.02 - Nathan Moreira

Este projeto consiste em uma arquitetura completa de **Microsserviços Orientada a Eventos** para monitoramento, processamento e análise de dados climáticos em tempo real.

O sistema foi desenhado focando em escalabilidade, desacoplamento de serviços e segurança robusta com autenticação JWT.

---

## 🏗️ Arquitetura da Solução

A solução é composta por 5 serviços principais rodando em containers Docker orquestrados:

1.  **🐍 Python Collector (Producer):** Coleta dados meteorológicos de APIs externas e os publica em uma fila de mensagens.
2.  **🐰 RabbitMQ (Message Broker):** Garante a comunicação assíncrona e resiliente entre os serviços.
3.  **🐹 Go Worker (Consumer):** Processa as mensagens da fila com alta performance e envia para a API.
4.  **🦅 NestJS API (Backend):** Gerencia a persistência (MongoDB), autenticação (JWT) e regras de negócio (IA Simbólica).
5.  **⚛️ React Dashboard (Frontend):** Interface moderna com atualização em tempo real, proteção de rotas e exportação de dados.

---

## 🚀 Tecnologias Utilizadas

| Área | Tecnologias |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | NestJS, Mongoose, Passport (JWT), BCrypt |
| **Worker** | Golang (Go), amqp091-go |
| **Collector** | Python 3.11, Pika |
| **Infraestrutura** | Docker, Docker Compose, RabbitMQ Management |
| **Banco de Dados** | MongoDB (NoSQL) |

---

## 🔐 Acesso ao Sistema (Credenciais)

O sistema possui controle de acesso via **Autenticação JWT**. Para acessar o Dashboard, utilize as credenciais de administrador:

* **URL do Dashboard:** [http://localhost:5173](http://localhost:5173)
* **Usuário:** `admin`
* **Senha:** `123`

> **Nota:** O usuário `admin` é criado automaticamente se não existir no banco de dados.

---

## 🛠️ Como Executar o Projeto

Todo o ambiente é containerizado. Você precisa apenas do **Docker** e **Docker Desktop** instalados.

### 1. Iniciar a Aplicação

Abra o terminal na raiz do projeto e execute:

```bash
docker compose up -d --build

Aguarde alguns instantes até que todos os containers estejam com status Started ou Healthy.

2. Verificar o Funcionamento
Frontend (Dashboard): Acesse http://localhost:5173

API (Backend): Rodando em http://localhost:3000

RabbitMQ (Painel): Acesse http://localhost:15672 (User: guest / Pass: guest)
```

✨ Diferenciais Implementados
1. 🧠 Inteligência Artificial Simbólica
Implementada no Backend (WeatherLogsService), esta lógica analisa estatisticamente os últimos registros para gerar insights em tempo real sem depender de APIs externas pagas:

Análise de Tendência: Identifica se a temperatura está em viés de alta 📈 ou baixa 📉.

Sistema de Alerta: Notifica condições críticas (Calor Extremo 🔥 ou Frio Intenso ❄️).

2. 🛡️ Segurança (Auth Guard)
Implementação completa de Register/Login no NestJS.

Proteção de rotas com Guards e JWT Strategy.

Frontend com redirecionamento automático para Login se o token for inválido.

3. 📉 Exportação de Dados
Funcionalidade no Frontend para converter os dados visualizados e baixar um relatório completo em formato .CSV para análise externa.

4. ⚡ Performance com Go
Utilização de Golang para o Worker de processamento, garantindo baixo consumo de memória e alto throughput no consumo da fila RabbitMQ.

📂 Estrutura do Projeto

```bash
├── 📂 go_worker/          # Consumidor da fila em Golang
├── 📂 nestjs_api/         # API Principal, Auth e Regras de Negócio
├── 📂 python_collector/   # Coletor de dados climáticos
├── 📂 react_frontend/     # Dashboard React + Vite
├── 📄 docker-compose.yml  # Orquestração dos containers
└── 📄 README.md           # Documentação
```

Desenvolvido por Nathan Moreira.
