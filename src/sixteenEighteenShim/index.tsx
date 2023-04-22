import { createRoot } from "react-dom/client"
import { FlowGraph } from "../flow/graph"
import React from "react"

export const eightenRootedFlow = (element: HTMLElement) => {
  const root = createRoot(element)
  root.render(<FlowGraph />)
  return root
}
