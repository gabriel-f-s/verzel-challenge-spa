# EliteTickets - Front-End (SPA) 🎨

Este é o diretório do **Front-End** da plataforma de ingressos EliteTickets, desenvolvido para o Desafio Elite Dev da Verzel.

A aplicação foi construída visando fornecer uma experiência visual para os três papéis (Organizador, Cliente e Portaria), garantindo uma interface rica, fluida e totalmente responsiva.

---

## 💻 Decisões de UX/UI & Tecnologias

Optou-se por um **visual dark e minimalista**, inspirado na rede de cinemas Cinemark.

### Tecnologias:
- **React + Vite**: Para um ambiente de desenvolvimento ultra-rápido e build otimizado.
- **Tailwind CSS v4**: Para uma estilização utilitária veloz, com variáveis CSS nativas gerenciando o tema (cores primárias, backgrounds, inputs).
- **Framer Motion**: Para adicionar micro-interações, como efeitos _hover_ suaves em cards de filmes e transições nos modais.
- **html5-qrcode**: Para habilitar o uso real da câmera do dispositivo do navegador na página da portaria, sem necessidade de apps de terceiros.
- **qrcode.react**: Para geração do QR Code injetado com o hash HMAC criado pela API.
- **Axios**: Interceptor configurado para adicionar automaticamente tokens JWT no cabeçalho das requisições e redirecionar em caso de erro `401 Unauthorized`.

---

## 📱 Principais Funcionalidades

### 1. Reserva em Mapa Interativo (`SeatSelectionModal`)
Para os eventos com lugares marcados (`SEATED`), o usuário cliente abre uma tela limpa contendo as fileiras e as poltronas. 
O front-end bloqueia visualmente os assentos que já foram retornados como indisponíveis. A etapa de pagamento possui simulação clara ("Pagar" ou "Simular Recusa").

### 2. Meus Ingressos (`/my-tickets`)
Painel do Cliente onde os tickets geram um modal com a capa do evento e um **QR Code vivo**. 
Tickets validados ficam esverdeados ("UTILIZADO"), enquanto tickets recém-comprados permanecem disponíveis ("DISPONÍVEL").

### 3. Validador da Portaria (`/scanner`)
A tela de portaria invoca a webcam instantaneamente no navegador usando a classe `<div id="qr-reader">`. 
O componente escuta cada _frame_, decodifica os hashes e faz a requisição à API.

### 4. Link Público (`/ticket/share/:token`)
Gera uma rota desprotegida (fora das amarras do Contexto de Autenticação) mas muito segura, 
exibindo apenas as informações de check-in que os usuários devem usar quando mandam o link para o Whatsapp dos amigos.

---

## 🚀 Como Rodar o Front-End

Para iniciar a SPA de forma independente (assumindo que a API já esteja rodando na porta `3000`):

1. Acesse o diretório SPA:
```bash
cd spa
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API, verificando se o `.env` ou se as configurações apontam para o local correto:
```env
VITE_API_URL=http://localhost:3000
```

4. Suba a aplicação:
```bash
npm run dev
```

A aplicação ficará disponível em [http://localhost:5173](http://localhost:5173). 

> Lembre-se: Use os e-mails fornecidos pelo `Seed` da API (ver o README.md na pasta principal/`api`) para alternar facilmente entre Organizador, Cliente e Portaria!
