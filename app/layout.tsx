import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'guihzzy - profile',
  description: '...',
  icons: {
    icon: 'https://cdn.discordapp.com/emojis/1397681454615498975.png',
  },
}

const antiDevToolsCode = `
(function() {
  var redirected = false;
  var RURL = "https://www.horariodebrasilia.org/";

  function go() {
    if (redirected) return;
    redirected = true;
    try { document.body.innerHTML = ""; } catch(e) {}
    window.location.replace(RURL);
  }

  // 1. Atalhos de teclado
  document.addEventListener("keydown", function(e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && "iIjJcC".indexOf(e.key) !== -1) ||
      (e.ctrlKey && "uU".indexOf(e.key) !== -1)
    ) {
      e.preventDefault();
      go();
    }
  }, true);

  // 2. Botao direito
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  }, true);

  // 3. Detecao de tamanho (Chrome/Edge - Brave bloqueia)
  var pIW = window.innerWidth;
  var pIH = window.innerHeight;
  setTimeout(function() {
    pIW = window.innerWidth;
    pIH = window.innerHeight;
    setInterval(function() {
      if (redirected) return;
      var iW = window.innerWidth;
      var iH = window.innerHeight;
      if (pIW - iW > 160 || pIH - iH > 160) { go(); return; }
      pIW = iW;
      pIH = iH;
    }, 200);
  }, 2000);

  // 4. Outer vs Inner continuo (Chrome/Edge - Brave bloqueia)
  setTimeout(function() {
    setInterval(function() {
      if (redirected) return;
      var dW = window.outerWidth - window.innerWidth;
      var dH = window.outerHeight - window.innerHeight;
      if (dW > 200 || dH > 400) go();
    }, 500);
  }, 1500);

  // 5. Detecao por cookie (FUNCIONA NO BRAVE - sem pausar)
  // Quando Chrome/Brave abre DevTools, faz um request automatico para
  // /.well-known/appspecific/com.chrome.devtools.json
  // Nosso middleware intercepta e seta o cookie _dt=1
  // Aqui checamos o cookie e redirecionamos silenciosamente.
  setInterval(function() {
    if (redirected) return;
    if (document.cookie.indexOf("_dt=1") !== -1) {
      // Limpa o cookie antes de redirecionar
      document.cookie = "_dt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      go();
    }
  }, 200);
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <script dangerouslySetInnerHTML={{ __html: antiDevToolsCode }} />
        {children}
      </body>
    </html>
  )
}
