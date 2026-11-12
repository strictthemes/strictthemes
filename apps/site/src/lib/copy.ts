/**
 * Copies text to the clipboard and says whether it worked. Uses the Clipboard
 * API, and falls back to selecting a hidden field where a browser or an
 * embedding page blocks that API.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const field = document.createElement("textarea")
    field.value = text
    field.setAttribute("readonly", "")
    field.style.position = "fixed"
    field.style.opacity = "0"
    document.body.append(field)
    field.select()
    let copied = false
    try {
      copied = document.execCommand("copy")
    } catch {
      // An old browser may refuse the command: the answer stays "not copied".
    }
    field.remove()
    return copied
  }
}

const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

/**
 * Shows a result on a button for a moment, then puts its label back. The
 * result is also written to the page's status line, which a screen reader
 * reads out: it does not announce a button whose own text changes.
 */
export function flash(button: HTMLElement, message: string): void {
  const label = button.dataset.label ?? button.textContent ?? ""
  button.dataset.label = label
  button.textContent = message
  const status = document.querySelector("[data-status]")
  if (status) status.textContent = message
  // A second click starts the wait again, so the label is not put back early.
  clearTimeout(timers.get(button))
  timers.set(
    button,
    setTimeout(() => {
      button.textContent = label
      if (status?.textContent === message) status.textContent = ""
    }, 1600)
  )
}

/**
 * Makes every `[data-copy-url]` button copy the text at its address, a page
 * prompt's Markdown. The text is fetched as soon as the page loads, because
 * browsers only allow a clipboard write straight after a click, not after
 * waiting for a download.
 */
export function copyPromptButtons(): void {
  const texts = new Map<string, string>()
  const load = async (url: string) => {
    const cached = texts.get(url)
    if (cached !== undefined) return cached
    const response = await fetch(url)
    if (!response.ok) throw new Error(String(response.status))
    const text = await response.text()
    texts.set(url, text)
    return text
  }

  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy-url]")) {
    const url = button.dataset.copyUrl ?? ""
    load(url).catch(() => {})
    button.addEventListener("click", async () => {
      try {
        const copied = await copyText(texts.get(url) ?? (await load(url)))
        flash(button, copied ? "Copied" : "Could not copy")
      } catch {
        flash(button, "Could not copy")
      }
    })
  }
}
