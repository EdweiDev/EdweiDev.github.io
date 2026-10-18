/* Google Analytics runs only on the published website, never local previews. */
(() => {
  if (location.hostname !== 'edweidev.github.io') return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;

  const measurementId = 'G-S80PVVEQZD';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // Exclude query strings and fragments from the initial pageview URL.
  const pageLocation = location.origin + location.pathname;
  let referrer = '';
  if (document.referrer) {
    try {
      const url = new URL(document.referrer);
      referrer = url.origin + url.pathname;
    } catch { /* An invalid referrer is omitted. */ }
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: pageLocation,
    page_referrer: referrer
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);
})();
