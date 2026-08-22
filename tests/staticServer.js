/**
 * @file Serves the generated static site and shuts down reliably when browser tests finish.
 */

import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import handler from "serve-handler";

/**
 * Creates an HTTP server for the generated distribution directory.
 *
 * @returns {import("node:http").Server} Unstarted static HTTP server.
 */
export function createStaticServer() {
    return createServer((request, response) => {
        handler(request, response, { public: "distribution" }).catch((error) => {
            response.statusCode = 500;
            response.end("Unable to serve the generated site.");
            console.error(error);
        });
    });
}

/**
 * Starts a static server on the browser-test address.
 *
 * @param {import("node:http").Server} server Static HTTP server to start.
 * @returns {Promise<void>} Resolves once the server is listening.
 */
export function startStaticServer(server) {
    return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(4173, "127.0.0.1", () => {
            server.off("error", reject);
            resolve();
        });
    });
}

/**
 * Stops the static server and closes persistent browser connections.
 *
 * @param {import("node:http").Server} server Static HTTP server to stop.
 * @returns {Promise<void>} Resolves once the server has closed.
 */
export function stopStaticServer(server) {
    return new Promise((resolve, reject) => {
        server.close((error) => error == null ? resolve() : reject(error));
        server.closeAllConnections();
    });
}

if (process.argv[1] != null && pathToFileURL(process.argv[1]).href === import.meta.url) {
    const server = createStaticServer();
    await startStaticServer(server);

    /**
     * Stops the command-line server and exits with an appropriate status.
     *
     * @returns {Promise<void>} Resolves after the shutdown attempt finishes.
     */
    async function shutDown() {
        try {
            await stopStaticServer(server);
            process.exit(0);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    process.once("SIGINT", shutDown);
    process.once("SIGTERM", shutDown);
}
