// The search field on /guides/. Titles and descriptions are on the page; the full text of the
// guides comes from /guides/search.json, fetched the first time someone searches.

interface Entry {
  slug: string
  text: string
}

const SNIPPET = 90

export function guideSearch(): void {
  const form = document.querySelector<HTMLFormElement>("[data-guide-search]")
  const input = document.querySelector<HTMLInputElement>("#guide-search")
  const status = document.querySelector<HTMLElement>("#guide-search-count")
  const items = [...document.querySelectorAll<HTMLLIElement>("[data-guide-list] > li")]
  if (!form || !input || !status || items.length === 0) return

  const total = items.length
  const texts = new Map<string, string>()
  let loading: Promise<void> | null = null

  const load = (): Promise<void> =>
    (loading ??= fetch("/guides/search.json")
      .then((response) => (response.ok ? (response.json() as Promise<Entry[]>) : []))
      .then((entries) => {
        for (const entry of entries) texts.set(entry.slug, entry.text)
      })
      .catch(() => undefined))

  const words = (query: string): string[] => query.toLowerCase().split(/\s+/).filter(Boolean)

  // A short passage of the text around the first word, with that word in bold.
  const snippet = (target: HTMLElement, text: string, word: string): void => {
    const at = text.toLowerCase().indexOf(word)
    const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, at - SNIPPET)) + 1)
    const endSpace = text.indexOf(" ", at + word.length + SNIPPET)
    const end = endSpace === -1 ? text.length : endSpace
    const strong = document.createElement("strong")
    strong.className = "font-semibold text-foreground"
    strong.textContent = text.slice(at, at + word.length)
    target.replaceChildren(
      `${start > 0 ? "… " : ""}${text.slice(start, at)}`,
      strong,
      `${text.slice(at + word.length, end)}${end < text.length ? " …" : ""}`
    )
    target.hidden = false
  }

  const list = items[0]?.parentElement

  // The whole phrase first; only when no guide has it, every word anywhere in a guide.
  const matches = (wanted: string[]) => {
    const phrase = wanted.join(" ")
    const test = (terms: string[]) =>
      items.map((item) => {
        const head = (item.dataset.head ?? "").toLowerCase()
        const body = texts.get(item.dataset.slug ?? "") ?? ""
        const lowerBody = body.toLowerCase()
        const ok = terms.every((term) => head.includes(term) || lowerBody.includes(term))
        const inHead = terms.every((term) => head.includes(term))
        return { item, body, ok, inHead, inText: terms.find((term) => !head.includes(term)) }
      })
    const byPhrase = test([phrase])
    return wanted.length > 1 && !byPhrase.some((m) => m.ok) ? test(wanted) : byPhrase
  }

  const run = (): void => {
    const query = input.value.trim()
    const wanted = words(query)
    let shown = 0
    const results = wanted.length === 0 ? items.map((item) => ({ item, body: "", ok: true, inHead: true, inText: undefined })) : matches(wanted)
    // Title matches first, then summary matches, then the rest; within each, newest first.
    const inTitle = (item: HTMLLIElement) => {
      const title = (item.querySelector("[data-title]")?.textContent ?? "").toLowerCase()
      return wanted.length > 0 && wanted.every((word) => title.includes(word))
    }
    const rank = (m: { item: HTMLLIElement; inHead: boolean }) => (inTitle(m.item) ? 0 : m.inHead ? 1 : 2)
    const ordered = [0, 1, 2].flatMap((r) => results.filter((m) => rank(m) === r))
    for (const { item, body, ok, inText } of ordered) {
      list?.append(item)
      const target = item.querySelector<HTMLElement>("[data-snippet]")
      item.hidden = !ok
      if (ok) shown++
      if (target) {
        if (ok && inText) snippet(target, body, inText)
        else target.hidden = true
      }
    }
    status.textContent =
      wanted.length === 0
        ? `${total} guides`
        : shown === 0
          ? `No guide matches “${query}”. Try fewer or shorter words.`
          : `${shown} of ${total} guides match “${query}”`
    const url = new URL(location.href)
    if (query) url.searchParams.set("q", query)
    else url.searchParams.delete("q")
    history.replaceState(null, "", url)
  }

  const search = (): void => {
    run()
    if (texts.size === 0 && input.value.trim()) void load().then(run)
  }

  form.addEventListener("submit", (event) => event.preventDefault())
  input.addEventListener("input", search)
  input.addEventListener("focus", () => void load(), { once: true })

  const initial = new URL(location.href).searchParams.get("q")
  if (initial) {
    input.value = initial
    search()
  }
}
