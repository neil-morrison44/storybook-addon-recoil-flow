import React, { useRef } from "react"
import { useState, useEffect } from "react"
import { useRecoilSnapshot } from "recoil"
import { RecoilEdge, RecoilNode } from "../types"
import justCompare from "just-compare"
import mix from "mix-css-color"

export const useRecoilNodesAndEdges = () => {
  const snapshot = useRecoilSnapshot()
  const [nodes, setNodes] = useState<RecoilNode[]>([])
  const [edges, setEdges] = useState<RecoilEdge[]>([])
  const previousContentRef = useRef<Record<string, any>>({})
  const framesSinceLastChangeRef = useRef<Record<string, number | undefined>>(
    {}
  )

  useEffect(() => {
    const snapshotNodes = Array.from(snapshot.getNodes_UNSTABLE())
    setNodes(
      snapshotNodes.map((snapshotNode): RecoilNode => {
        const { key } = snapshotNode
        const value = snapshot.getLoadable(snapshotNode)
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)

        const previousContents = previousContentRef.current[key]
        const hasChanged: boolean =
          previousContents !== undefined &&
          !justCompare(previousContentRef.current[key], value.contents)
        previousContentRef.current[key] = value.contents

        let framesSinceLastChange =
          framesSinceLastChangeRef.current[key] ?? Infinity

        if (hasChanged) {
          framesSinceLastChange = 0
        } else {
          framesSinceLastChange += 1
        }

        framesSinceLastChangeRef.current[key] = framesSinceLastChange
        const colourShift = Math.max(0, 3 - framesSinceLastChange) / 3

        return {
          id: key,
          label: key,
          fill: mix("#EFC580", "#AACBD2", colourShift * 100).hex,
          size: hasChanged ? 14 : 8,
          data: {
            contents: value.contents,
            lastUpdate: framesSinceLastChange,
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
          size: 3,
        }))
      })
    )
  }, [snapshot])
  return { nodes, edges }
}
