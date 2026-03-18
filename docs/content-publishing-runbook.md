# Wikip.co Content Publishing Runbook

This runbook documents the end-to-end path from research ingestion to the live `wikip.co` site.

## Repo Roles

- `research-tools`: agent-facing tooling for discovery, scraping, packet creation, and content updates.
- `content`: markdown source of truth plus GitHub Actions that trigger downstream site rebuilds.
- `wikip.co`: Hexo site repo with the content and public repos mounted as submodules.
- `public`: generated static HTML, pushed by workflow and deployed by Cloudflare Pages.

## End-to-End Flow

1. An agent analyzes a paper or PDF and decides whether to update an existing article or create a new one in `content`.
2. The agent uses `research-tools` to search for an existing target, scrape the source, and prepare or append content.
3. The agent commits the markdown change in `content` on a branch and opens a PR there.
4. After the PR merges to `content/main`, `trigger-sites.yml` dispatches a `content-updated` event to `wikip.co`.
5. `wikip.co/.github/workflows/generator.yml` calls the reusable deploy workflow from `wikip-co/content@main`.
6. The deploy workflow checks out:
   - `site/source/_posts` from `wikip-co/content`
   - `public` from `wikip-co/public`
7. Hexo builds the site and writes generated assets into `public`.
8. The workflow commits and pushes the generated HTML to `wikip-co/public`.
9. Cloudflare Pages publishes from `wikip-co/public`.

## Agent Workflow Expectations

When assigning a task like "analyze a PDF, incorporate findings into content, and open a PR", the expected output is:

- Content changes only in `content`, not in `wikip.co/public`.
- Every published claim or bullet tied to a footnote citation.
- A proper reference entry in the target markdown file.
- A branch and PR in `content`.
- No manual HTML editing.

Useful commands from `research-tools`:

```bash
./agent-workflow search "topic or phrase"
./agent-workflow match "candidate title"
./agent-workflow check-ref "https://source-url"
./agent-workflow prepare "https://source-url" --category "Path/To/Category" --create-new --tag Research
./agent-workflow append "https://source-url" --target "Path/To/Article.md" --section "Section Name" --apply
```

For a local PDF analysis task, the agent may need to extract findings manually if the source is not directly scrapeable by URL. The final publication target is still the `content` repo, and the PR should be opened there.

## Local Verification

From `wikip.co`:

```bash
git submodule update --init --recursive
npm ci --prefix site
NODE_OPTIONS=--max-old-space-size=5168 npm --prefix site run build
```

This verifies that the current site code can build against the checked-out `content` submodule state. It does not push anything to `public`.

## Troubleshooting

If `wikip.co` deploy fails:

- Check whether `generator.yml` is pinned to an outdated reusable workflow SHA from `content`.
- Confirm the failing step actually exists in the pinned `hexo-deploy.yml`, not just on `content/main`.
- Confirm both submodules resolve correctly:
  - `site/source/_posts` should point to `wikip-co/content`
  - `public` should point to `wikip-co/public`
- If the failure is in Hexo build output, reproduce locally with `npm --prefix site run build`.
- If `content` merged but no rebuild started, inspect `content/.github/workflows/trigger-sites.yml` and the `repository_dispatch` event payload.

## Current Known Issue

The failed `wikip.co` run at `2026-03-17` was using an older pinned reusable workflow commit that still executed:

- `Set up Python`
- `Validate content`

That issue was fixed first by updating the pinned SHA, and then by switching `wikip.co` to track `wikip-co/content@main` so deploy logic stays aligned across the repos.
