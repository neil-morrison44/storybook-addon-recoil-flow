import React from "react"
import { useState, useEffect, ReactElement } from "react"
import { Edge, Node } from "react-flow-renderer"
import { useRecoilSnapshot } from "recoil"

interface RecoilNode extends Node {
  data: {
    label: ReactElement
    contents: any
    type: "atom" | "selector"
  }
}
type RecoilNodeWithoutPosition = Omit<RecoilNode, "position">
interface RecoilEdge extends Edge {}

export const useRecoilNodesAndEdges = () => {
  const snapshot = useRecoilSnapshot()
  const [nodes, setNodes] = useState<RecoilNodeWithoutPosition[]>([])
  const [edges, setEdges] = useState<RecoilEdge[]>([])

  useEffect(() => {
    const snapshotNodes = Array.from(snapshot.getNodes_UNSTABLE())
    setNodes(
      snapshotNodes.map((snapshotNode): RecoilNodeWithoutPosition => {
        const value = snapshot.getLoadable(snapshotNode)
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)
        return {
          id: snapshotNode.key,
          data: {
            label: (
              <>
                <div key="node-title">{`${info.type}: ${snapshotNode.key}`}</div>
                <div key="node-value">{JSON.stringify(value.contents)}</div>
              </>
            ),
            contents: value.contents,
            type: info.type,
          },
        }
      })
    )

    setEdges(
      snapshotNodes.flatMap((snapshotNode): RecoilEdge[] => {
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)
        const deps = Array.from(info.deps)
        const componentSubs = Array.from(info.subscribers.components)
        return deps.map((dep) => ({
          id: `${snapshotNode.key}-${dep.key}`,
          source: dep.key,
          target: snapshotNode.key,
          animated: true,
        }))
      })
    )
  }, [snapshot])
  return { nodes, edges }
}
