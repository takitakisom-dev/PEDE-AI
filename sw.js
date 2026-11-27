// PEDE AÍ - André Taki - Service Worker
// Faz o app funcionar offline e poder instalar no celular

const CACHE_NOME = 'pedeai-andre-v3';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('[PEDE AÍ] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NOME).then((cache) => {
      return cache.addAll(ARQUIVOS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[PEDE AÍ] Ativando...');
  event.waitUntil(
    caches.keys().then((nomes) => {
      return Promise.all(
        nomes.map((nome) => {
          if (nome !== CACHE_NOME) {
            console.log('[PEDE AÍ] Apagando cache velho:', nome);
            return caches.delete(nome);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Não guarda pedidos da nuvem no cache, só o app
  if (event.request.url.includes('ntfy.sh')) {
    return;
  }
  if (event.request.url.includes('qrserver.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((resposta) => {
        if (resposta) return resposta;
        return caches.match('./index.html');
      });
    })
  );
});
