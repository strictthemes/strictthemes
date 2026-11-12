export type Kind = "added" | "changed" | "fixed" | "removed"

export const kinds: Kind[] = ["added", "changed", "fixed", "removed"]

export type Change = { kind: Kind; text: string }

export type Release = {
  version: string
  /** ISO date, YYYY-MM-DD */
  date: string
  changes: Change[]
}

// Newest first. Text in backticks is set as inline code.
export const releases: Release[] = [
  {
    version: "2.4.0",
    date: "2026-11-10",
    changes: [
      {
        kind: "added",
        text: "Every branch you push now gets its own preview deploy, with its address printed at the end of `plinth deploy`.",
      },
      {
        kind: "added",
        text: "`plinth deploy --wait` holds the terminal until the deploy is live and exits non-zero if it fails, so CI jobs can depend on it.",
      },
      {
        kind: "changed",
        text: "Uploads skip files whose hash the server already has, which makes a typical redeploy about three times faster.",
      },
      {
        kind: "fixed",
        text: "`plinth logs --follow` no longer stops after an hour of no output.",
      },
    ],
  },
  {
    version: "2.3.2",
    date: "2026-10-28",
    changes: [
      {
        kind: "fixed",
        text: "`plinth deploy` no longer uploads the `.git` folder when a project sets `include = [\"*\"]` in `plinth.toml`.",
      },
      {
        kind: "fixed",
        text: "The progress bar now draws correctly in terminals narrower than 60 columns.",
      },
    ],
  },
  {
    version: "2.3.1",
    date: "2026-10-21",
    changes: [
      {
        kind: "fixed",
        text: "`plinth env pull` now keeps quotes around values that contain a `#`, so they are no longer cut off as comments.",
      },
      {
        kind: "fixed",
        text: "Signing in with `plinth login` works again behind a proxy set in `HTTPS_PROXY`.",
      },
      {
        kind: "fixed",
        text: "`plinth --version` prints the version without checking for updates first.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-10-06",
    changes: [
      {
        kind: "added",
        text: "`plinth env pull` writes a project's environment variables to `.env.local`, so local runs match production.",
      },
      {
        kind: "changed",
        text: "`plinth env set` now asks before it overwrites a variable; pass `--force` to skip the question in scripts.",
      },
      {
        kind: "removed",
        text: "The `plinth secrets` command is gone; use `plinth env` instead, which reads and writes the same variables.",
      },
    ],
  },
  {
    version: "2.2.1",
    date: "2026-09-22",
    changes: [
      {
        kind: "fixed",
        text: "Deploys from Windows now keep the executable bit on files under `bin/`.",
      },
      {
        kind: "fixed",
        text: "`plinth rollback` lists the last 20 deploys again instead of only the last one.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "2026-09-08",
    changes: [
      {
        kind: "added",
        text: "`plinth rollback` returns production to an earlier deploy in a few seconds, without rebuilding.",
      },
      {
        kind: "added",
        text: "`plinth deploy --message` attaches a note to a deploy, shown in `plinth list` and the console.",
      },
      {
        kind: "changed",
        text: "`plinth list` now shows the 20 most recent deploys by default; pass `--limit` to see more.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-08-18",
    changes: [
      {
        kind: "added",
        text: "`plinth logs --follow` streams a deploy's logs as they arrive.",
      },
      {
        kind: "changed",
        text: "Build output is now grouped by step, and steps that pass fold to a single line.",
      },
      {
        kind: "fixed",
        text: "`plinth init` no longer overwrites an existing `plinth.toml` without asking.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "2026-08-04",
    changes: [
      {
        kind: "fixed",
        text: "`plinth migrate` now converts the `redirects` list from `plinth.json` instead of dropping it.",
      },
      {
        kind: "fixed",
        text: "Error messages for an invalid `plinth.toml` now name the line and the key at fault.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2026-07-21",
    changes: [
      {
        kind: "added",
        text: "`plinth migrate` turns an existing `plinth.json` into a `plinth.toml` in one step.",
      },
      {
        kind: "changed",
        text: "Projects are now configured in `plinth.toml`, which allows comments and keeps settings for each environment in its own table.",
      },
      {
        kind: "changed",
        text: "`plinth deploy` now stops on the first failed build step instead of uploading a half-built project.",
      },
      {
        kind: "removed",
        text: "`plinth.json` is no longer read: run `plinth migrate` before you upgrade, or your deploys will use the default settings.",
      },
    ],
  },
]
