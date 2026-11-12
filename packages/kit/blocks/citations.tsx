import { useId } from "react"

export interface Source {
  title: string
  url: string
  /** Where it was published: a site or a document's name. */
  site?: string
  /** The passage the answer rests on, word for word. */
  quote?: string
}

const OUTLINE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/** The id of a source's entry in the list, for a marker to point at. */
export const sourceId = (prefix: string, index: number): string => `${prefix}-${index}`

export interface CitationProps {
  /** The source's number in the list, starting at 1. */
  index: number
  /** The same prefix the `Sources` list was given. */
  prefix?: string
}

/** A marker in running text that points at one source in the list below. */
export function Citation({ index, prefix = "source" }: CitationProps) {
  return (
    <sup>
      <a
        href={`#${sourceId(prefix, index)}`}
        aria-label={`Source ${index}`}
        className={`px-sp-xs type-label text-foreground underline underline-offset-2 hover:decoration-2 ${OUTLINE}`}
      >
        {index}
      </a>
    </sup>
  )
}

export interface SourcesProps {
  sources: Source[]
  title?: string
  /** Set it when a page has more than one list, so the ids stay apart. */
  prefix?: string
}

/**
 * The sources an answer cites, in the order of their markers: each with its
 * title as a link, where it is from, and the passage that was used.
 */
export function Sources({ sources, title = "Sources", prefix = "source" }: SourcesProps) {
  const heading = useId()
  return (
    <section aria-labelledby={heading} className="flex flex-col gap-sp-md">
      <h3 id={heading} className="type-label text-muted-foreground">
        {title}
      </h3>
      <ol className="flex flex-col gap-sp-sm">
        {sources.map((source, at) => (
          <li
            key={source.url}
            id={sourceId(prefix, at + 1)}
            className="flex gap-sp-md rounded-lg border border-border bg-card p-sp-md text-card-foreground"
          >
            <span aria-hidden="true" className="shrink-0 type-label text-muted-foreground">
              {at + 1}
            </span>
            <div className="flex min-w-0 flex-col gap-sp-sm">
              <a
                href={source.url}
                className={`text-body text-foreground underline underline-offset-4 hover:decoration-2 ${OUTLINE}`}
              >
                {source.title}
              </a>
              {source.site !== undefined && <p className="type-label text-muted-foreground">{source.site}</p>}
              {source.quote !== undefined && (
                <blockquote className="border-l-2 border-border pl-sp-md text-body text-muted-foreground">
                  {source.quote}
                </blockquote>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
