import { useEffect, useState } from "react"

export const usePanelPosition = () => {
  const [position, setPosition] = useState<"bottom" | "right">("bottom")

  useEffect(() => {
    const rootParent = document.querySelector(
      "#storybook-panel-root"
    )?.parentElement
    if (!rootParent) return

    const updatePosition = () => {
      const newPosition = rootParent.style.left === "0px" ? "bottom" : "right"
      setPosition(newPosition)
    }

    updatePosition()

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") updatePosition()
      })
    })
    observer.observe(rootParent, { attributes: true })
    return () => observer.disconnect()
  }, [])

  return position
}
