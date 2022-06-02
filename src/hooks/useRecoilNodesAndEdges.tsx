import React from "react"
import { useState, useEffect } from "react"
import { useRecoilSnapshot } from "recoil"
import { RecoilEdge, RecoilNode } from "../types"

export const useRecoilNodesAndEdges = () => {
  const snapshot = useRecoilSnapshot()
  const [nodes, setNodes] = useState<RecoilNode[]>([])
  const [edges, setEdges] = useState<RecoilEdge[]>([])

  useEffect(() => {
    const snapshotNodes = Array.from(snapshot.getNodes_UNSTABLE())
    setNodes(
      snapshotNodes.map((snapshotNode): RecoilNode => {
        const value = snapshot.getLoadable(snapshotNode)
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)
        return {
          id: snapshotNode.key,
          label: snapshotNode.key,
          data: {
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
