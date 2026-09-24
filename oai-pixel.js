/* ── OpenAI Ads Measurement Pixel – DSGVO-konform ─────────────────────────
   Pixel-ID: 4b8WHG4wdAUjb9fMrC9SSD
   Dieses Snippet wird auf allen Seiten geladen, aber das Tracking-Script
   (oaiq.min.js) wird ERST nach Marketing-Einwilligung vom Server abgerufen.
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* Stub-Queue: speichert Aufrufe, bis das echte SDK geladen ist.
     Keine Netzwerkverbindung, kein Tracking ohne Einwilligung. */
  if (!window.oaiq) {
    var q = function () { q.q.push(arguments); };
    q.q = [];
    window.oaiq = q;
  }

  var loaded = false;

  /* Lädt oaiq.min.js und initialisiert den Pixel – darf nur nach
     Marketing-Einwilligung aufgerufen werden. */
  function doLoad() {
    if (loaded) return;
    loaded = true;
    var j = document.createElement('script');
    j.async = true;
    j.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
    var f = document.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(j, f);
    window.oaiq('init', { pixelId: '4b8WHG4wdAUjb9fMrC9SSD', debug: false });
  }

  /* Öffentliche Funktion – von allen Accept-Handlern aufzurufen:
     ► main.js          → acceptBtn, mapConsentBtn
     ► Inline-Consent   → acceptAllCk(), saveCkSet(), acceptCookie(),
                          cookieAccept-Listener                            */
  window.loadOpenAIPixel = doLoad;

  /* ── Beim Seitenaufruf: vorhandene Einwilligung prüfen ────────────── */
  function checkConsent() {
    /* Format 1  – main.js-Seiten + gebaeudereinigung-berlin/checkliste  */
    if (localStorage.getItem('lak_cookie_consent') === 'accepted') {
      doLoad(); return;
    }
    /* Format 2  – bueroreinigung-berlin/*, gebaeudereinigung-berlin/*   */
    try {
      var ck = JSON.parse(localStorage.getItem('lak_ck') || 'null');
      if (ck && ck.mktg === true) { doLoad(); return; }
    } catch (e) { /* korrupter Eintrag – ignorieren */ }
    /* Format 3  – ueber-uns.html (Legacy)                               */
    if (localStorage.getItem('cookieConsent') === 'accepted') {
      doLoad();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkConsent);
  } else {
    checkConsent();
  }
}());
