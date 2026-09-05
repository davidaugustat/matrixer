<script setup>
/**
 * @file Defines site-wide document metadata and favicons.
 */

useHead({
    meta: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "apple-mobile-web-app-title", content: "Matrixer" },
        { name: "application-name", content: "Matrixer" },
        { name: "msapplication-TileColor", content: "#ffffff" },
        {
            name: "msapplication-config",
            content: "/assets/img/favicons/browserconfig.xml"
        },
        { name: "theme-color", content: "#ffffff" }
    ],
    link: [
        {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/assets/img/favicons/apple-touch-icon.png"
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/assets/img/favicons/favicon-32x32.png"
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/assets/img/favicons/favicon-16x16.png"
        },
        { rel: "manifest", href: "/assets/img/favicons/site.webmanifest" },
        { rel: "shortcut icon", href: "/assets/img/favicons/favicon.ico" },
        {
            rel: "mask-icon",
            href: "/assets/img/favicons/safari-pinned-tab.svg",
            color: "#5bbad5"
        }
    ]
});
</script>
