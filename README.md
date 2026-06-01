<div align="center">

#  Flash-Card IA

### Gerador inteligente de flashcards com Inteligência Artificial

Cole qualquer texto — aula, artigo ou livro — e a IA cria perguntas e respostas
personalizadas para fixar o aprendizado.

<br/>

[![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)](https://flash-cards-psi-orpin.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

**[ Ver demo ao vivo](https://flash-cards-psi-orpin.vercel.app)**

</div>

---

##  Sobre o projeto

O **Flash-Card IA** é uma aplicação web full-stack que integra um modelo de linguagem de grande escala (LLM) para transformar qualquer texto em flashcards de estudo de forma automática.

O projeto foi desenvolvido do zero com foco em **arquitetura limpa**, **experiência do usuário** e **segurança**. Toda a comunicação com a API de IA passa por um servidor Node.js intermediário, garantindo que credenciais sensíveis nunca sejam expostas no navegador.

---

##  Funcionalidades

| Funcionalidade | Descrição |
|---|---|
|  **Geração por IA** | Analisa o texto e cria entre 6 e 12 flashcards agrupados por tópico |
| **Níveis de dificuldade** | Fácil, Médio e Difícil — cada nível altera o tipo de pergunta gerada |
| **Animação de flip 3D** | Cards com frente (pergunta) e verso (resposta), animação CSS 3D no desktop |
| **Relatório de desempenho** | Aproveitamento geral e breakdown de acertos/erros por tópico |
|  **Biblioteca pessoal** | Baralhos salvos no `localStorage` com histórico de desempenho |
|  **Regenerar perguntas** | Gera novas questões diferentes a partir do mesmo texto, com dificuldade escolhida |
|  **Painel colapsável** | Texto de referência retrátil durante o estudo |
|  **Truncamento automático** | Textos acima de 24.000 caracteres são cortados com aviso ao usuário |
|  **Dark / Light mode** | Alternância com animação, preferência salva no `localStorage` |
|  **Design responsivo** | Layout adaptado para mobile com botões fixos no rodapé |
|  **API Key protegida** | Credenciais guardadas no servidor, nunca expostas no frontend |

---

##  Tecnologias

###  Frontend

| Tecnologia | Versão | Papel no projeto |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de UI — componentes, estado e ciclo de vida |
| [Vite](https://vitejs.dev/) | 8 | Bundler e servidor de desenvolvimento com HMR |
| CSS Modules | — | Estilização com escopo por componente, sem conflitos de classe |
| Google Fonts | — | Tipografia: *Lora* (serif, nos cards) + *DM Sans* (interface) |

###  Backend

| Tecnologia | Papel no projeto |
|---|---|
| [Node.js](https://nodejs.org/) 18+ | Servidor proxy HTTP — protege a API Key e repassa requisições |
| Módulos nativos (`http`, `https`, `fs`) | Zero dependências externas no backend |

###  Inteligência Artificial

| Tecnologia | Papel no projeto |
|---|---|
| [Groq API](https://console.groq.com/) | Plataforma de inferência — plano gratuito com 12.000 tokens/min |
| [LLaMA 3.3 70B](https://groq.com/) | Modelo de linguagem para análise de texto e geração de JSON |

###  Infraestrutura

| Serviço | Função |
|---|---|
| [Vercel](https://vercel.com/) | Hospedagem do frontend — deploy automático via GitHub |
| [Render](https://render.com/) | Hospedagem do backend Node.js — plano gratuito |
| [GitHub](https://github.com/) | Versionamento e integração com Vercel/Render |

---

##  Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    React + Vite (Vercel)                    │
│                                                             │
│  InputScreen → useFlashcards hook → services/api.js        │
│       ↓               ↓                    ↓               │
│  StudyScreen     localStorage         POST /api/flashcards  │
│       ↓          (Biblioteca)               ↓              │
│    Results                                  ↓              │
└─────────────────────────────────────────────────────────────┘
                              │
                    vercel.json (rewrite)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          BACKEND                            │
│                    Node.js (Render)                         │
│                                                             │
│   server.js → injeta GROQ_API_KEY → Groq API              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    LLaMA 3.3 70B → JSON de flashcards
```

### Por que um servidor proxy?

Chamar a API do Groq diretamente do navegador exporia a API Key para qualquer pessoa que abrisse o DevTools. O `server.js` atua como intermediário seguro: o frontend chama `/api/flashcards` (mesma origem), o servidor injeta a chave e repassa para o Groq.

### Arquitetura de níveis de dificuldade

O nível selecionado altera o prompt enviado ao modelo, produzindo perguntas com complexidade cognitiva diferente:

```
Fácil   → Perguntas diretas de definição e memorização (Bloom: Lembrar)
Médio   → Perguntas de compreensão e relação entre conceitos (Bloom: Compreender)
Difícil → Perguntas de análise, síntese e raciocínio crítico (Bloom: Analisar/Avaliar)
```

---

##  Estrutura do projeto

```
Flash-Cards/
├── server.js               # Servidor Node.js — proxy seguro para o Groq
├── vercel.json             # Rewrites do Vercel para /api/* → Render
├── .env.example            # Modelo das variáveis de ambiente
├── .gitignore              # node_modules, dist, .env
├── vite.config.js          # Vite + proxy local /api/* → :3001
├── package.json
├── index.html              # HTML raiz com Google Fonts
└── src/
    ├── App.jsx             # Raiz: gerencia tema, fases e biblioteca
    ├── main.jsx            # Ponto de entrada React
    │
    ├── styles/
    │   └── global.css      # Variáveis CSS (light/dark), reset, tipografia
    │
    ├── services/
    │   └── api.js          # Fetch para /api/flashcards + prompt por dificuldade
    │                       # + truncamento automático de texto (24k chars)
    │
    ├── hooks/
    │   └── useFlashcards.js # Custom Hook central:
    │                        # handleGenerate, handleStudyDeck,
    │                        # handleRegenerateDeck, handleAnswer, handleRestart
    │
    └── components/
        ├── TopBar/          # Barra superior: logo, tabs, toggle tema (animado)
        ├── InputScreen/     # Tela inicial: nome, dificuldade, texto, contador
        ├── LoadingScreen/   # Spinner durante chamada à API
        ├── FlashCard/       # Card com flip 3D (desktop) / toggle (mobile)
        ├── StudyScreen/     # Layout de estudo: painel colapsável + progresso
        ├── Results/         # Relatório: métricas + breakdown por tópico
        └── Library/         # Biblioteca: histórico, desempenho, regenerar
```

---

##  Decisões técnicas relevantes

### Custom Hook centralizado (`useFlashcards.js`)
Toda a lógica de estado fica em um único hook, mantendo os componentes puramente visuais. Isso facilita testes, manutenção e reutilização.

### CSS Modules
Cada componente tem seu próprio arquivo `.module.css`. Elimina conflitos de nomes, facilita manutenção e mantém o CSS colocado com o componente que o usa.

### Persistência com `localStorage`
Os baralhos são salvos diretamente no navegador — sem banco de dados externo. O ID de cada baralho é gerado uma única vez (na criação), garantindo que re-estudar o mesmo baralho atualize o registro existente em vez de criar duplicatas.

### Truncamento automático de texto
O plano gratuito do Groq tem limite de 12.000 tokens/min (~1 token = 3-4 caracteres). Textos acima de 24.000 caracteres são truncados automaticamente em `api.js`, com aviso visual ao usuário, evitando o erro 413 (*Payload Too Large*).

### Flip adaptado para mobile
A animação de flip 3D com `position: absolute` causa problemas em browsers mobile. No mobile, a lógica troca para mostrar/esconder as faces via CSS (`display: flex/none`), mantendo a mesma experiência sem quebrar o layout.

---

##  Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- Chave gratuita do [Groq](https://console.groq.com/) — sem cartão de crédito

---

##  Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/jonaass/Flash-Cards.git
cd Flash-Cards
```

### 2. Configure o ambiente

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Edite o `.env`:

```env
GROQ_API_KEY=gsk_sua_chave_aqui
GROQ_MODEL=llama-3.3-70b-versatile
```

> Obtenha sua chave gratuita em [console.groq.com](https://console.groq.com)

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie os dois serviços

**Terminal 1 — backend:**
```bash
node server.js
# ✓ Servidor rodando em http://localhost:3001
# ✓ Groq API Key carregada
```

**Terminal 2 — frontend:**
```bash
npm run dev
# ✓ http://localhost:5173
```

---

##  Variáveis de ambiente

| Variável | Obrigatório | Descrição |
|---|---|---|
| `GROQ_API_KEY` |  Sim | Chave da API do Groq |
| `GROQ_MODEL` |  Opcional | Modelo a usar (padrão: `llama-3.3-70b-versatile`) |

>  O arquivo `.env` está no `.gitignore` e **nunca deve ser commitado**.

---

##  Deploy em produção

O projeto usa dois serviços gratuitos em conjunto:

```
Usuário → Vercel (frontend) → vercel.json rewrite → Render (backend) → Groq API
```

**Vercel (frontend):**
1. Importe o repositório em [vercel.com](https://vercel.com)
2. Build Command: `npm run build` | Output: `dist`

**Render (backend):**
1. New Web Service → conecte o repositório
2. Start Command: `node server.js`
3. Adicione `GROQ_API_KEY` e `GROQ_MODEL` nas variáveis de ambiente
4. Copie a URL gerada e atualize o `vercel.json`

> O plano gratuito do Render tem *cold start* de ~30s após inatividade.

---

<div align="center">
  <sub>Construído com React, Node.js e LLaMA 3.3 · Hospedado no Vercel + Render</sub>
</div>