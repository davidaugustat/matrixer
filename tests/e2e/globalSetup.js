/**
 * @file Starts and stops the generated-site server around the Playwright test run.
 */

import {
    createStaticServer,
    startStaticServer,
    stopStaticServer
} from "../staticServer";

/**
 * Starts the generated site and returns Playwright's global teardown callback.
 *
 * @returns {Promise<function(): Promise<void>>} Teardown callback that stops the static server.
 */
export default async function globalSetup() {
    const server = createStaticServer();
    await startStaticServer(server);
    return () => stopStaticServer(server);
}
