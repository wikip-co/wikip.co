# wikip.co
A static wiki built with node.js

- Architecture
  - `site/source/_posts` is the `wikip-co/content` submodule that supplies markdown.
  - `public` is the `wikip-co/public` submodule that stores generated HTML assets.
  - This repo owns Hexo config, themes, workflow glue, and the reusable workflow reference used for deploys.

- URLs
  - Cloudflare:
    - https://wikip.co/
    - https://www.wikip.co/
    - https://public-kb6.pages.dev/
  - Fleek.co
    - https://ipfs.wikip.co/
    - https://wikip.on.fleek.co/

- Docker
  - https://hub.docker.com/r/anthonyrussano/wikip.co
  - `docker run -p 4000:4000 anthonyrussano/wikip.co`

- Local setup
  - `git submodule update --init --recursive`
  - `npm ci --prefix site`
  - `NODE_OPTIONS=--max-old-space-size=5168 npm --prefix site run build`

- Workflow
  - Site-only changes under `site/**` trigger `.github/workflows/generator.yml` on push to `main`.
  - Markdown changes in `wikip-co/content` trigger `content/.github/workflows/trigger-sites.yml`, which sends a `repository_dispatch` to `wikip.co`.
  - `generator.yml` calls the reusable `wikip-co/content/.github/workflows/hexo-deploy.yml@main` workflow and passes the exact `content_ref` and `content_sha` from that dispatch payload.
  - The reusable workflow checks out the `content` submodule at that exact SHA, builds Hexo, writes the output into the `public` submodule, and pushes the generated site to `wikip-co/public`.
  - Cloudflare Pages deploys from `wikip-co/public`, so `wikip.co` itself is the build orchestrator, not the final hosting repo.

## Publishing Flow

1. An agent or human edits markdown in `wikip-co/content`.
2. Those changes land on `content/main` through a normal commit or merged PR.
3. `content` dispatches a rebuild event to `wikip.co` with the exact markdown commit SHA.
4. `wikip.co` builds against that SHA and pushes generated HTML to `wikip-co/public`.
5. Cloudflare Pages publishes from `wikip-co/public`.

The operator runbook for this flow lives at [`docs/content-publishing-runbook.md`](docs/content-publishing-runbook.md).

## Reusable Workflow Tracking

`wikip.co` intentionally tracks `wikip-co/content@main` for the reusable deploy workflow so site deploy behavior stays aligned with the current content-pipeline logic. If deploy behavior changes unexpectedly, check the `uses:` line in [`.github/workflows/generator.yml`](.github/workflows/generator.yml) and then inspect the latest version of `content/.github/workflows/hexo-deploy.yml`.
