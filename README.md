# ⚡ Flash-Card IA

> Transforme qualquer texto em flashcards de estudo com Inteligência Artificial.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)


---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e uso](#-instalação-e-uso)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Deploy](#-deploy)
- [Autor](#-autor)

---

## 📖 Sobre o projeto

O **Flash-Card IA** é uma aplicação web que usa Inteligência Artificial para gerar flashcards de estudo automaticamente a partir de qualquer texto. Cole um conteúdo — aula, artigo, resumo, capítulo de livro — e a IA analisa, identifica os tópicos principais e cria perguntas e respostas para fixar o aprendizado.

Durante o estudo, o usuário responde se lembrou ou não de cada card. Ao final, a aplicação exibe um relatório completo de desempenho por tópico. Os baralhos são salvos automaticamente em uma **Biblioteca** pessoal, onde é possível rever o histórico e estudar novamente quando quiser.

---

## ✨ Funcionalidades

- 📝 **Geração automática** de flashcards a partir de texto colado pelo usuário
- 🃏 **Animação de flip 3D** nos cards — frente (pergunta) e verso (resposta)
- ✅ **"Lembrei" e "Não Sei"** — registro de acertos e erros em tempo real
- 📊 **Relatório de desempenho** com aproveitamento geral e breakdown por tópico
- 📚 **Biblioteca de baralhos** — histórico salvo no navegador com desempenho de cada sessão
- 🔄 **Estudar novamente** — releia qualquer baralho salvo sem precisar gerar de novo
- 📄 **Painel de texto colapsável** — referência ao texto original durante o estudo, ocultável com um clique
- 🌙 **Dark mode / Light mode** — alternância manual, preferência salva automaticamente
- 📱 **Layout responsivo** — funciona em desktop e mobile
- 🔒 **API Key protegida** — nunca exposta no navegador, guardada no servidor

---

## 🛠 Tecnologias

### 🖥 Frontend

| Tecnologia | Versão | Categoria | Finalidade |
|---|---|---|---|
| [React](https://react.dev/) | 19 | UI Library | Componentes, estado e renderização |
| [Vite](https://vitejs.dev/) | 8 | Build Tool | Servidor de desenvolvimento e build de produção |
| CSS Modules | — | Estilização | CSS com escopo por componente, sem conflitos |
| JavaScript ES6+ | — | Linguagem | Lógica, async/await, hooks e destructuring |
| Google Fonts | — | Tipografia | Lora (cards) + DM Sans (interface) |

### ⚙️ Backend

| Tecnologia | Versão | Categoria | Finalidade |
|---|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Runtime | Servidor proxy que protege a API Key |
| `http` / `https` | nativo | Módulo Node | Servidor HTTP e requisições para a Groq |
| `fs` / `path` | nativo | Módulo Node | Leitura do `.env` e arquivos estáticos |

### 🤖 Inteligência Artificial

| Tecnologia | Categoria | Finalidade |
|---|---|---|
| [Groq API](https://console.groq.com/) | API de IA | Plataforma de inferência gratuita e rápida |
| [LLaMA 3.3 70B](https://groq.com/) | Modelo LLM | Análise do texto e geração dos flashcards em JSON |

### 🛠 Ferramentas

| Ferramenta | Finalidade |
|---|---|
| [Git](https://git-scm.com/) | Versionamento do código |
| [GitHub](https://github.com/) | Hospedagem do repositório |
| [VS Code](https://code.visualstudio.com/) | Editor de código |
| [Vercel](https://vercel.com/) | Hospedagem gratuita do frontend |
| [Render](https://render.com/) | Hospedagem gratuita do backend |

---

## 🏗 Arquitetura

```
Usuário → React (Vite :5173) → Node.js (:3001) → Groq API → LLaMA 3.3 70B
```

O servidor Node.js atua como **proxy seguro**: recebe as requisições do React, injeta a API Key e repassa para a Groq. A chave nunca fica exposta no navegador.

A **Biblioteca** usa `localStorage` para persistir os baralhos estudados diretamente no navegador — sem banco de dados externo.

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Git](https://git-scm.com/)
- Chave de API gratuita do [Groq](https://console.groq.com/) — sem necessidade de cartão

---

## 🚀 Instalação e uso

### 1. Clone o repositório

```bash
git clone https://github.com/jonaass/Flash-Cards.git
cd Flash-Cards
```

### 2. Configure as variáveis de ambiente

```bash
copy .env.example .env   # Windows
cp .env.example .env     # Mac/Linux
```

Abra o `.env` e preencha:

```env
GROQ_API_KEY=gsk_sua_chave_aqui
GROQ_MODEL=llama-3.3-70b-versatile
```

> Obtenha sua chave gratuita em [console.groq.com](https://console.groq.com)

### 3. Instale as dependências

```bash
npm install
```

### 4. Terminal 1 — inicie o servidor proxy

```bash
node server.js
```

Resultado esperado:
```
✓ Servidor rodando em http://localhost:3001
✓ Groq API Key carregada
✓ Modelo: llama-3.3-70b-versatile
```

### 5. Terminal 2 — inicie o frontend

```bash
npm run dev
```

### 6. Acesse no navegador

```
http://localhost:5173
```

---

## 📁 Estrutura de pastas

```
Flash-Cards/
├── server.js               # Servidor Node.js — proxy para a API do Groq
├── .env.example            # Modelo de configuração das variáveis
├── vite.config.js          # Config do Vite + proxy /api → :3001
├── package.json
├── index.html              # HTML raiz com Google Fonts
└── src/
    ├── App.jsx             # Componente raiz — gerencia tema e telas
    ├── main.jsx            # Ponto de entrada React
    ├── styles/
    │   └── global.css      # Variáveis CSS de tema (light/dark) + reset
    ├── services/
    │   └── api.js          # Comunicação com o backend
    ├── hooks/
    │   └── useFlashcards.js # Todo o estado e lógica da aplicação
    └── components/
        ├── TopBar/         # Barra superior com logo, tabs e toggle de tema
        ├── InputScreen/    # Tela inicial — entrada de texto e nome do baralho
        ├── LoadingScreen/  # Spinner durante a geração dos cards
        ├── FlashCard/      # Card individual com animação de flip 3D
        ├── StudyScreen/    # Layout de estudo com painel colapsável
        ├── Results/        # Relatório final de desempenho
        └── Library/        # Biblioteca de baralhos salvos
```

---

## 🔐 Variáveis de ambiente

| Variável | Descrição | Obrigatório |
|---|---|---|
| `GROQ_API_KEY` | Chave de API do Groq | ✅ Sim |
| `GROQ_MODEL` | Modelo de IA a usar | ⬜ Opcional (padrão: `llama-3.3-70b-versatile`) |

> ⚠️ **Nunca suba o arquivo `.env` para o GitHub.** Ele já está no `.gitignore`.

---

## ☁️ Deploy

| Parte | Plataforma | Plano |
|---|---|---|
| Frontend (React) | [Vercel](https://vercel.com/) | Gratuito |
| Backend (Node.js) | [Render](https://render.com/) | Gratuito (750h/mês) |

**Vercel (frontend):**
- Importe o repositório → Build Command: `npm run build` → Output: `dist`

**Render (backend):**
- New Web Service → Start Command: `node server.js`
- Adicione `GROQ_API_KEY` e `GROQ_MODEL` nas variáveis de ambiente

> O plano gratuito do Render pode ter cold start de ~30 segundos após inatividade.

---

## 👨‍💻 Autor

Feito por **Jonas**

[![GitHub](https://img.shields.io/badge/GitHub-jonaass-181717?logo=github)](https://github.com/jonaass)


---

<p align="center">Feito com ☕ e muito estudo</p>
