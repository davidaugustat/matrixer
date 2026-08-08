<script setup>
/**
 * @file Provides the English About page content.
 */
</script>

<template>
    <div>
        <h1>About This Website</h1>
        <p class="lead">
            I created Matrixer to make my life easier. My math class at university involves a lot of
            calculations on finite fields. Usual calculators however, only support calculations with real
            numbers and even <a href="https://www.wolframalpha.com/" target="_blank">Wolfram Alpha</a> can't properly
            deal with finite fields. That is why I decided, that it was time to build my own calculator. This
            is what I came up with.
        </p>
        <p class="lead">
            Matrixer is completely open source and you can view the code
            <a href="https://github.com/davidaugustat/matrixer" target="_blank">here</a>.
        </p>

        <h3>Technologies Used on This Website:</h3>
        <ul>
            <li>
                <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank"><b>JavaScript:</b></a><br>
                I coded the entire math engine powering this website in JavaScript. The calculator is
                completely front end, so there is no server back end but everything is calculated in the
                user's browser.
            </li>
            <li>
                <a href="https://getbootstrap.com" target="_blank"><b>Bootstrap:</b></a><br>
                Bootstrap is a CSS framework which makes it a lot easier to create good-looking websites. It
                greatly reduced the amount of work I had to put into building the user interface of this
                website.
            </li>
            <li>
                <a href="https://vuejs.org/" target="_blank"><b>Vue.js:</b></a><br>
                Vue.js is a JavaScript framework for building user interfaces. I use Vue.js to obtain the user input
                from the GUI, to display calculation results and to provide the English and German interfaces.
            </li>
            <li>
                <a href="https://katex.org" target="_blank"><b>KaTeX:</b></a><br>
                KaTeX is a math typesetting library. It takes usual LaTeX code as an input and displays it as
                a mathematical expression on the screen. I use this library to display the results of the
                calculations. My own code generates LaTeX code as an output which is then given to KaTeX to
                display the result on screen.
            </li>
            <li>
                <a href="https://vite.dev/" target="_blank"><b>Vite:</b></a><br>
                Vite is an <a href="https://www.npmjs.com" target="_blank">NPM</a>-based frontend build tool. I use
                it to bundle the JavaScript and Vue.js files used by the calculator into optimized static files.
                This makes the website easier to develop and reduces its loading time.
            </li>
            <li>
                <a href="https://www.namecheap.com/logo-maker/" target="_blank"><b>Namecheap Logo Maker:</b></a><br>
                To be honest, the Matrixer logo isn't very creative. However, this website just needed a logo
                and Namecheap's logo maker was the right tool for that job, because it took less that 5
                minutes to create a halfway decent looking logo.
            </li>
            <li>
                <a href="https://realfavicongenerator.net" target="_blank"><b>RealFaviconGenerator:</b></a><br>
                I generated this site's favicon (the little icon in the tab of your browser) using
                RealFaviconGenerator. This tool automatically scales your icon to the required image sizes
                and creates the HTML code necessary to include the favicon on the website.
            </li>
        </ul>
    </div>
</template>
