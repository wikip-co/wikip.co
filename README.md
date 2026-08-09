# wikip.co

A static wiki built with Node.js and Hexo.

## Architecture

- `wikip-co/content` is the markdown source of truth.
- `wikip-co/wikip.co` owns Hexo configuration, themes, local build helpers, and deployment orchestration.
- `wikip-co/public` stores generated HTML for Cloudflare Pages.

The repositories are independent. There are no Git submodules in this repo. Content is copied into the ignored `site/source/_posts` directory for a build, and Hexo writes generated output into the ignored `public` directory.

The upstream Research local-model publisher operates only in the `content`
repository: it prepares an isolated Markdown patch and optional draft PR, then
requires human review and merge. It does not invoke Hexo directly, edit this
repository, write generated output, or auto-merge. The normal exact-SHA flow
below begins only after `content/main` changes.

## Local build

With `content` and `wikip.co` checked out as siblings:

```bash
./scripts/build-site
```

The helper uses `../content`, applies `site-content-excludes.txt`, installs the locked Node dependencies, restores markdown modification times from content history, and builds the site. To use another checkout:

```bash
CONTENT_REPO_ROOT=/path/to/content ./scripts/build-site
```

If there is no sibling checkout and `CONTENT_REPO_ROOT` is unset, `scripts/prepare-content` fetches `wikip-co/content` into the ignored `.build/content-repo` directory. Set `CONTENT_REF` to build another branch, tag, or commit.

## Deployment

1. A markdown change merged to `content/main` triggers `content/.github/workflows/trigger-sites.yml`.
2. The content workflow dispatches `content_ref` and the exact `content_sha` to this repository.
3. `.github/workflows/generator.yml` checks out that content revision and `wikip-co/public` into ignored build directories.
4. The workflow prepares a plain `_posts` tree, restores markdown mtimes, and builds Hexo.
5. Generated output is synchronized into the temporary `public` checkout, committed, and pushed.
6. Cloudflare Pages publishes `wikip-co/public`; the workflow also publishes the Docker image.

Site-only changes under `site/**`, build-helper changes under `scripts/**`, Dockerfile changes, and workflow changes trigger the same build directly.

## URLs

- https://wikip.co/
- https://www.wikip.co/
- https://public-kb6.pages.dev/
- https://ipfs.wikip.co/
- https://wikip.on.fleek.co/

Docker image: `anthonyrussano/wikip.co`

```bash
docker run -p 4000:4000 anthonyrussano/wikip.co
```

The cross-repository [production operations](https://github.com/wikip-co/Research/blob/main/docs/research-production-operations.md) and [content publishing runbook](https://github.com/wikip-co/Research/blob/main/docs/content-publishing-runbook.md) are centralized in `wikip-co/Research`.
