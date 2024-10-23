let thirdPartyConnections = 0;
let firstPartyCookies = 0;
let thirdPartyCookies = 0;
let superCookiesDetected = false;
let localStorageCount = 0;
let hijackingDetected = false;
let canvasFingerprint = null;
let currentDomain = '';

// Função para atualizar o domínio atual
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url) {
        currentDomain = new URL(tab.url).hostname;
    }
});

// Detecta conexões de terceiros
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        let url = new URL(details.url);
        if (!url.hostname.includes(currentDomain)) {
            thirdPartyConnections += 1;

            // Armazena o número de conexões de terceiros
            chrome.storage.local.set({ thirdPartyConnections });
        }
    },
    { urls: ['<all_urls>'] }
);

// Monitorar mudanças de cookies
chrome.cookies.onChanged.addListener(function (changeInfo) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        if (tabs.length > 0) {
            let cookie = changeInfo.cookie;
            let activeDomain = new URL(tabs[0].url).hostname;

            // Verifica se o cookie pertence ao domínio atual ou a terceiros
            if (cookie.domain.includes(activeDomain)) {
                firstPartyCookies += 1;
            } else {
                thirdPartyCookies += 1;
            }

            // Armazena os resultados dos cookies
            chrome.storage.local.set({
                firstPartyCookies,
                thirdPartyCookies
            });
        }
    });
});

// Detecção de supercookies (IndexedDB)
let request = indexedDB.open('SuperCookieTest', 1);
request.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.createObjectStore('store');
};
request.onsuccess = function () {
    superCookiesDetected = true;
    chrome.storage.local.set({ superCookiesDetected });
};

// Verificação de itens no localStorage
if (localStorage.length > 0) {
    localStorageCount = localStorage.length;
    chrome.storage.local.set({ localStorageCount });
}

// Detecção de Canvas Fingerprinting
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
ctx.textBaseline = 'top';
ctx.font = '14px Arial';
ctx.textBaseline = 'alphabetic';
ctx.fillStyle = '#f60';
ctx.fillRect(125, 1, 62, 20);
ctx.fillStyle = '#069';
ctx.fillText('Privacy Test', 2, 15);
canvasFingerprint = canvas.toDataURL();
chrome.storage.local.set({ canvasFingerprint });

// Detecção de sequestro de navegador (Browser Hijacking)
let checkHijacking = () => {
    let scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (!script.src.includes(window.location.hostname)) {
            hijackingDetected = true;
            chrome.storage.local.set({ hijackingDetected });
            break;
        }
    }
};
setInterval(checkHijacking, 5000);

// Função para "zerar" os dados
function resetData() {
    thirdPartyConnections = 0;
    firstPartyCookies = 0;
    thirdPartyCookies = 0;
    superCookiesDetected = false;
    localStorageCount = 0;
    hijackingDetected = false;
    canvasFingerprint = null;
    chrome.storage.local.clear();
}

// Armazenar valores em chrome.storage.local
function storeValues() {
    chrome.storage.local.set({
        thirdPartyConnections,
        firstPartyCookies,
        thirdPartyCookies,
        superCookiesDetected,
        localStorageCount,
        hijackingDetected,
        canvasFingerprint
    }, function () {
        console.log('Valores de privacidade armazenados.');
    });
}

// Verificar mudanças de domínio e zerar dados ao mudar de site
chrome.webNavigation.onCommitted.addListener(function (details) {
    if (details.frameId === 0) { // Apenas frame principal
        let newDomain = new URL(details.url).hostname;

        // Se o domínio mudou, reseta os dados
        if (newDomain !== currentDomain) {
            currentDomain = newDomain;
            resetData();
        }
    }
});

// Limpar os dados quando a aba for fechada
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    resetData();
});

// Enviar valores para o popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'getPrivacyScore') {
        let privacyScore = calculatePrivacyScore();
        storeValues(); // Armazenar os valores antes de responder ao popup

        sendResponse({
            thirdPartyConnections,
            firstPartyCookies,
            thirdPartyCookies,
            superCookiesDetected,
            localStorageCount,
            hijackingDetected,
            canvasFingerprint,
            privacyScore
        });
    }
});

// Pontuação de privacidade
function calculatePrivacyScore() {
    let score = 1000; // Base inicial 1000 pontos
    score -= thirdPartyConnections * 1; // Subtrai 1 ponto por conexão de terceiros
    score -= firstPartyCookies * 0.5; // Subtrai 0,5 ponto por cookie de primeira parte
    score -= thirdPartyCookies * 2; // Subtrai 2 pontos por cookie de terceiros
    if (superCookiesDetected) score -= 50; // Subtrai 50 pontos se supercookie for detectado
    score -= localStorageCount * 0.5; // Subtrai 0,5 ponto por item de LocalStorage
    if (hijackingDetected) score -= 100; // Subtrai 100 pontos se tentativa de hijacking for detectada
    if (canvasFingerprint) score -= 30; // Subtrai 30 pontos se Canvas Fingerprinting for detectado

    return Math.max(score, 0); // Garante que a pontuação não seja negativa
}
