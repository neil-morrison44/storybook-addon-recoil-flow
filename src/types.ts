import { ReactElement } from "react"
import { GraphEdge, GraphNode } from "reagraph"

export interface RecoilNode extends GraphNode {
  data: {
    contents: any
    type: "atom" | "selector"
    lastUpdate: number
  }
}

export interface RecoilEdge extends GraphEdge {}
