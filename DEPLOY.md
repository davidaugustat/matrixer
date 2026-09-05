## Automated deployment

Every push to `master` runs the complete GitHub Actions test suite. After linting, logic tests, the production build
and browser tests succeed, the generated `distribution` artifact is compressed and deployed to the production web
hosting over SSH. To retry a failed deployment, manually run the **Build and test** workflow on the `master` branch;
the complete test suite runs again before deployment. Pull requests and manual runs on other branches do not deploy.

Configure these repository secrets under **Settings > Secrets and variables > Actions**:

| Secret | Value |
| --- | --- |
| `DEPLOY_SSH_HOST` | SSH hostname without an `ssh://` prefix |
| `DEPLOY_SSH_PORT` | SSH port, normally `22` |
| `DEPLOY_SSH_USER` | SSH username |
| `DEPLOY_SSH_PRIVATE_KEY` | Unencrypted private key authorized by the hosting account |
| `DEPLOY_SSH_KNOWN_HOSTS` | Verified `known_hosts` entry for the configured hostname and port |
| `DEPLOY_TARGET_DIRECTORY` | Existing website directory, absolute or relative to the SSH login directory |

Obtain the server's public host-key line from the hosting provider or with
`ssh-keyscan -p <port> <hostname>`, verify its fingerprint through a trusted provider channel, and store the complete
verified line in `DEPLOY_SSH_KNOWN_HOSTS`. The target directory must already exist, be writable by the SSH user, and
must not be `/` or the SSH login directory itself. Its path may contain letters, digits, dots, underscores, slashes
and hyphens. The SSH login directory, which is used as the temporary archive location, must also be writable. Keeping
the archive there prevents it from becoming publicly downloadable through the target website.