<script setup>
/**
 * @file Defines site-wide document metadata, stylesheets, favicons, and initial Matomo setup.
 */

const runtimeConfig = useRuntimeConfig();
const matomoBaseUrl = runtimeConfig.public.matomoBaseUrl.endsWith("/")
    ? runtimeConfig.public.matomoBaseUrl
    : `${runtimeConfig.public.matomoBaseUrl}/`;
const matomoScript = `
    if (window.location.hostname === ${JSON.stringify(runtimeConfig.public.hostEnableAnalytics)}) {
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableHeartBeatTimer', 15]);
        _paq.push(['enableLinkTracking']);
        (function() {
            var u=${JSON.stringify(matomoBaseUrl)};
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '2']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
    }
`;

useHead({
    link: [
        {
            rel: "mask-icon",
            href: "/assets/img/favicons/safari-pinned-tab.svg",
            color: "#5bbad5"
        }
    ],
    script: [
        {
            type: "text/javascript",
            innerHTML: matomoScript
        }
    ]
});
</script>

<template>
    <Head>
        <Meta charset="UTF-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link
            rel="stylesheet"
            href="https://static.davidaugustat.com/fonts/roboto/roboto-font.css"
            tag-priority="high"
        />
        <Link
            rel="stylesheet"
            href="https://static.davidaugustat.com/bootstrap-4.6.0/css/bootstrap.min.css"
            tag-priority="high"
        />
        <Link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicons/apple-touch-icon.png" />
        <Link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicons/favicon-32x32.png" />
        <Link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicons/favicon-16x16.png" />
        <Link rel="manifest" href="/assets/img/favicons/site.webmanifest" />
        <Link rel="shortcut icon" href="/assets/img/favicons/favicon.ico" />
        <Meta name="apple-mobile-web-app-title" content="Matrixer" />
        <Meta name="application-name" content="Matrixer" />
        <Meta name="msapplication-TileColor" content="#ffffff" />
        <Meta name="msapplication-config" content="/assets/img/favicons/browserconfig.xml" />
        <Meta name="theme-color" content="#ffffff" />
    </Head>
</template>
