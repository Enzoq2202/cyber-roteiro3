# Extensão de Detecção de Privacidade e Segurança

## Visão Geral

Essa extensão para navegador detecta e alerta sobre violações de privacidade e possíveis ameaças de segurança enquanto você navega. Ela monitora fatores como conexões de terceiros, uso de cookies, armazenamento local, tentativas de sequestro do navegador e fingerprinting de canvas. Além disso, atribui uma pontuação de privacidade com base nesses parâmetros.

## Funcionalidades

- **Conexões de Terceiros**: Detecta conexões feitas com domínios externos que não são do site principal.
- **Monitoramento de Cookies**: Monitora a quantidade de cookies de primeira e de terceira parte injetados na página.
- **Detecção de Supercookies**: Verifica se o site usa IndexedDB (supercookies).
- **Armazenamento Local (LocalStorage)**: Detecta se o site está utilizando o armazenamento local.
- **Fingerprinting de Canvas**: Identifica tentativas de fingerprinting de canvas.
- **Sequestro do Navegador (Hijacking)**: Monitora scripts que possam tentar sequestrar o navegador.
- **Pontuação de Privacidade**: Atribui uma pontuação para cada página, de acordo com as detecções feitas.

## Como Funciona

1. **Background Script**: Monitora as requisições de rede, cookies e atividades de armazenamento em segundo plano para coletar informações sobre conexões de terceiros, uso de cookies e tentativas de sequestro do navegador.
2. **Content Script**: Executa na página para detectar fingerprinting de canvas e monitorar o uso de armazenamento local.
3. **Popup**: Mostra os resultados em tempo real, incluindo conexões de terceiros, quantidade de cookies, tentativas de sequestro, fingerprinting de canvas e a pontuação de privacidade da página.

## Sistema de Pontuação de Privacidade

A pontuação de privacidade é calculada com base nos seguintes critérios:

- **Conexões de Terceiros**: -1,5 pontos por conexão.
- **Cookies de Primeira Parte**: -0,3 pontos por cookie.
- **Cookies de Terceiros**: -3 pontos por cookie.
- **Supercookies**: -75 pontos se detectado.
- **LocalStorage**: -1 ponto por item armazenado.
- **Sequestro do Navegador**: -200 pontos se detectado.
- **Fingerprinting de Canvas**: -50 pontos se detectado.

A pontuação começa em 1000 e nunca será negativa.

