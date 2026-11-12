/**
 * Keeps a built example page, shown in a frame on this site, in the color mode
 * this site chooses for it. On its own the page follows the visitor's system
 * setting, and sets its mode again whenever that changes.
 *
 * Returns a function to call when the chosen mode has changed.
 */
export function holdMode(
  frame: HTMLIFrameElement,
  mode: () => "light" | "dark"
): () => void {
  let watcher: MutationObserver | undefined

  const apply = () => {
    const root = frame.contentDocument?.documentElement
    if (!root) return
    const wanted = mode()
    const other = wanted === "dark" ? "light" : "dark"
    if (root.classList.contains(wanted) && !root.classList.contains(other)) return
    root.classList.remove(other)
    root.classList.add(wanted)
  }

  const attach = () => {
    watcher?.disconnect()
    const root = frame.contentDocument?.documentElement
    if (!root) return
    apply()
    watcher = new MutationObserver(apply)
    watcher.observe(root, { attributes: true, attributeFilter: ["class"] })
  }

  frame.addEventListener("load", attach)
  attach()
  return apply
}
