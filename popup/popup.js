document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get([
        'thirdPartyConnections',
        'firstPartyCookies',
        'thirdPartyCookies',
        'superCookiesDetected',
        'localStorageCount',
        'hijackingDetected',
        'canvasFingerprint'
    ], function (result) {
        console.log('Valores recebidos do armazenamento local:', result);

        document.getElementById('third-party').innerText = result.thirdPartyConnections || '0';
        document.getElementById('first-party-cookies').innerText = result.firstPartyCookies || '0';
        document.getElementById('third-party-cookies').innerText = result.thirdPartyCookies || '0';
        document.getElementById('super-cookies').innerText = result.superCookiesDetected ? 'Yes' : 'No';
        document.getElementById('local-storage').innerText = result.localStorageCount || '0';
        document.getElementById('hijacking').innerText = result.hijackingDetected ? 'Detected' : 'None';
        document.getElementById('fingerprinting').innerText = result.canvasFingerprint ? 'Detected' : 'None';

        // Calcular a pontuação de privacidade no popup com o novo sistema
        let privacyScore = 1000;
        privacyScore -= (result.thirdPartyConnections || 0) * 1;
        privacyScore -= ((result.firstPartyCookies || 0) * 0.5);
        privacyScore -= ((result.thirdPartyCookies || 0) * 2);
        if (result.superCookiesDetected) privacyScore -= 50;
        if (result.hijackingDetected) privacyScore -= 100;
        if (result.canvasFingerprint) privacyScore -= 30;

        privacyScore = Math.max(privacyScore, 0); // Impede pontuação negativa
        document.getElementById('privacy-score').innerText = privacyScore;
    });
});
