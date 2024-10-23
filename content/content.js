// Verifica o armazenamento local (localStorage) e armazena a contagem de itens
let localStorageCount = 0;
if (localStorage.length > 0) {
    console.log("Dados no LocalStorage detectados.");
    localStorageCount = localStorage.length;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            console.log(key + " = " + localStorage[key]);
        }
    }
    // Armazena o número de itens no chrome.storage.local
    chrome.storage.local.set({ localStorageCount }, function() {
        console.log("LocalStorage count stored:", localStorageCount);
    });
} else {
    chrome.storage.local.set({ localStorageCount: 0 }, function() {
        console.log("No LocalStorage items found.");
    });
}

// Detecta Canvas Fingerprinting e armazena o fingerprinting gerado
let canvasFingerprint = null;
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
ctx.font = "14px 'Arial'";
ctx.textBaseline = "alphabetic";
ctx.fillStyle = "#f60";
ctx.fillRect(125, 1, 62, 20);
ctx.fillStyle = "#069";
ctx.fillText("Privacy Test", 2, 15);
canvasFingerprint = canvas.toDataURL();
console.log("Canvas Fingerprint detectado: ", canvasFingerprint);

// Armazena o fingerprint gerado
chrome.storage.local.set({ canvasFingerprint }, function() {
    console.log("Canvas Fingerprint stored.");
});

// Detecção de sequestro de navegador (hijacking) e armazenar tentativa
let hijackingDetected = false;
let checkHijacking = () => {
    let scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
        if (!script.src.includes(window.location.hostname)) {
            hijackingDetected = true;
            console.log("Possível tentativa de sequestro (script externo detectado): ", script.src);

            // Armazena a detecção de hijacking
            chrome.storage.local.set({ hijackingDetected }, function() {
                console.log("Browser Hijacking attempt stored.");
            });
        }
    }
};
setInterval(checkHijacking, 5000);

// Certifica-se de que a detecção de hijacking é resetada entre intervalos
chrome.storage.local.set({ hijackingDetected: false }, function() {
    console.log("Hijacking detection reset.");
});
