/**
 * @file Serves the generated static site for Playwright's managed web-server lifecycle.
 */

import { createServer } from "node:http";
import handler from "serve-handler";

const server = createServer((request, response) => {
    handler(request, response, { public: "distribution" }).catch((error) => {
        response.statusCode = 500;
        response.end("Unable to serve the generated site.");
        console.error(error);
    });
});

server.listen(4173, "127.0.0.1");

/**
 * Stops the static server and exits with an appropriate status.
 *
 * @returns {void}
 */
function shutDown() {
    server.closeAllConnections();
    server.close((error) => {
        if (error != null) {
            console.error(error);
            process.exitCode = 1;
        }
    });
}

process.once("SIGINT", shutDown);
process.once("SIGTERM", shutDown);
