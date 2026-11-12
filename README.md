<img src="apps/site/public/icon-192.png" width="64" height="64" alt="">

# Strict

Themes and guardrails for AI-built UI.

The whole project is offered for free under the [MIT licence](LICENSE): there
is no paid tier. The roadmap is on [strictthemes.com](https://strictthemes.com).

## Packages

| Package | What it does | Status |
|---|---|---|
| [`@strictthemes/spec`](packages/spec) | Parses, lints and exports Strict design specs (`DESIGN.md` + a `strict` rules block). Everything else builds on it. | First version, [on npm](https://www.npmjs.com/package/@strictthemes/spec) since 2026-11-12 |
| [`@strictthemes/themes`](packages/themes) | The thirteen free themes, five page prompts for each, and the build that turns them into a shadcn registry. | First version, served from strictthemes.com/r |
| [`@strictthemes/check`](packages/check) | Strict Check: checks a project's code and its rendered pages against a spec, and scores it. | First version, [on npm](https://www.npmjs.com/package/@strictthemes/check) since 2026-11-12 |
| [`@strictthemes/site`](apps/site) | strictthemes.com, built with Astro: theme pages with live previews, a built example page for every page prompt, the registry and the spec docs. | First version, live on strictthemes.com |

[`skills/strict-check`](skills/strict-check/SKILL.md) is the skill that has a
coding agent run Strict Check on its own work.

Strict Check also runs as a CI job: the
[check's README](packages/check/README.md#in-ci) has a GitLab CI and a GitHub
Actions example, and this repo's own
[workflow](.github/workflows/ci.yml) checks the site with it.

Planned: the DESIGN.md generator, theme components and skills, and the agent
UI kit.

## Develop

Needs Node 24 (`nvm use`).

```bash
npm install
```

```bash
npm test
```

```bash
npm run build
```

`npm run build` also writes the theme registry to `packages/themes/dist`.
Run the site locally with `npm run dev --workspace @strictthemes/site`.

Try the CLI on the example theme after building:

```bash
node packages/spec/dist/cli.js lint packages/spec/examples/strict-one/DESIGN.md
```

```bash
node packages/spec/dist/cli.js export packages/spec/examples/strict-one/DESIGN.md --format shadcn
```

The format is described in [packages/spec/SPEC.md](packages/spec/SPEC.md).

