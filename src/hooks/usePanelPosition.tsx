import { useEffect, useState } from "react"

export const usePanelPosition = () => {
  const [position, setPosition] = useState<"bottom" | "right">("bottom")

  useEffect(() => {
    const rootElem = document.querySelector(
      "#storybook-panel-root"
    )
    if (!rootElem) return

    const updatePosition = () => {
      const boundingBox = rootElem.getBoundingClientRect()
      const newPosition = boundingBox.width > boundingBox.height ? "bottom" : "right"
      setPosition(newPosition)
    }

    updatePosition()

    const observer = new ResizeObserver(function (){
      updatePosition()
    })

    observer.observe(rootElem)
    return () => observer.disconnect()
  }, [])

  return position
}
