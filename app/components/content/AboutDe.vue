<script setup>
/**
 * @file Provides the unchanged German About-page content.
 */
</script>

<template>
    <div>
        <h1>Über diese Webseite</h1>
        <p class="lead">
            Ich habe Matrixer programmiert, um ein eigenes Problem zu lösen. In der Mathevorlesung an der Uni
            wird sehr viel über endlichen Körpern anstelle von reellen Zahlen gerechnet. Allerdings können
            gewöhnliche Taschenrechner nur mit reellen Zahlen rechnen und sogar
            <a href="https://www.wolframalpha.com/" target="_blank">Wolfram Alpha</a> beherrscht
            endliche Körper nur sehr eingeschränkt. Daher habe ich entschieden, dass es an der Zeit ist,
            meinen eigenen Rechner zu programmieren. Das hier ist das Resultat.
        </p>
        <p class="lead">
            Matrixer ist ein Open-Source-Projekt und du kannst den Code
            <a href="https://github.com/davidaugustat/matrixer" target="_blank">hier</a> ansehen.
        </p>

        <h3>Technologien auf dieser Webseite:</h3>
        <ul>
            <li>
                <a href="https://de.wikipedia.org/wiki/JavaScript" target="_blank"><b>JavaScript:</b></a><br>
                Ich habe den Rechner komplett in JavaScript programmiert. Der Code ist vollständig
                Front-End-basierend, es gibt daher kein Server-Back-End und die Berechnungen werden alle im
                Browser durchgeführt.
            </li>
            <li>
                <a href="https://getbootstrap.com" target="_blank"><b>Bootstrap:</b></a><br>
                Boostrap ist ein CSS-Framework, welches das Erstellen von gutaussehenden Webseiten deutlich
                vereinfacht. Bootstrap hat mir daher viel Arbeit beim Erstellen der Benutzeroberfläche erspart.
            </li>
            <li>
                <a href="https://vuejs.org" target="_blank"><b>Vue.js:</b></a><br>
                Vue.js ist ein JavaScript-Framework, welches Zugriffe auf die grafische Benutzeroberfläche
                deutlich einfacher gestaltet, als es in reinem JavaScript der Fall ist. Ich benutze Vue.js,
                um die Eingaben des Benutzers (gewählter Körper und mathematischer Ausdruck) von der GUI
                einzulesen und um das Ergebnis auszugeben.
            </li>
            <li>
                <a href="https://katex.org" target="_blank"><b>KaTeX:</b></a><br>
                KaTeX ist eine Bibliothek zum Darstellen mathematischer Notation auf Webseiten. Man kann
                damit gewöhnlichen LaTeX-Code in mathematische Schreibweise umwandeln und auf dem Bildschirm
                anzeigen. Ich benutze KaTeX, um das Ergebnis der Berechnungen graphisch darzustellen.
                Mein eigener Code generiert dabei LaTeX-Code als Ausgabe, welcher dann an KaTeX übergeben
                wird, um den Code auf dem Bildschirm darzustellen.
            </li>
            <li>
                <a href="https://nuxt.com" target="_blank"><b>Nuxt:</b></a><br>
                Nuxt ist ein <a href="https://www.npmjs.com" target="_blank">NPM</a>-basiertes Vue-Framework. Ich
                benutze es, um die Seiten dieser Webseite zu strukturieren und vollständige statische Dateien
                zu erzeugen, die ohne Server-Back-End gehostet werden können.
            </li>
            <li>
                <a href="https://vite.dev" target="_blank"><b>Vite:</b></a><br>
                Vite ist das von Nuxt verwendete Build-Werkzeug. Es bündelt und minimiert die JavaScript- und
                CSS-Dateien für die produktive Webseite und stellt den Entwicklungsserver für die Arbeit an
                Matrixer bereit.
            </li>
            <li>
                <a href="https://www.namecheap.com/logo-maker/" target="_blank"><b>Namecheap Logo Maker:</b></a><br>
                Sind wir ehrlich, das Matrixer-Logo ist nicht gerade kreativ. Trotzdem braucht diese Webseite
                ein Logo, und Namecheaps Logo Maker war genau das richtige Werkzeug dafür. Es hat gerade
                einmal 5 Minuten gedauert, ein halbwegs akzeptables Logo zu erstellen.
            </li>
            <li>
                <a href="https://realfavicongenerator.net" target="_blank"><b>RealFaviconGenerator:</b></a><br>
                Ich habe das Favicon (das kleine Symbol im Browser-Tab) mit dem RealFaviconGenerator
                generiert. Dieses Online-Werkzeug skaliert das Icon automatisch auf die benötigten Bildgrößen
                und erzeugt zusätzlich einen HTML-Schnipsel, der benötigt wird, um das Favicon in die
                Webseite einzufügen.
            </li>
        </ul>
    </div>
</template>
