import React, { useEffect, useState } from "react"
import ReactFlow, { MiniMap, Controls, Node, Edge } from "react-flow-renderer"
import { useRecoilSnapshot, useRecoilValue } from "recoil"
import { SelectorOne } from "../register"

interface RecoilNode extends Node {}
interface RecoilEdge extends Edge {}

export const FlowGraph = () => {
  const snapshot = useRecoilSnapshot()
  const [nodes, setNodes] = useState<RecoilNode[]>([])
  const [edges, setEdges] = useState<RecoilEdge[]>([])

  useRecoilValue(SelectorOne)

  useEffect(() => {
    console.debug("Changed Atoms:")
    const snapshotNodes = Array.from(snapshot.getNodes_UNSTABLE())

    console.log("nodes!")

    setNodes(
      snapshotNodes.map((snapshotNode): RecoilNode => {
        const value = snapshot.getLoadable(snapshotNode)
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)
        return {
          id: snapshotNode.key,
          data: {
            label: (
              <div>
                <div>{`${info.type}: ${snapshotNode.key}`}</div>
                <div>{value.contents}</div>
              </div>
            ),
            contents: value.contents,
            type: info.type,
          },
          position: {
            x: Math.random() * 500,
            y: info.type === "atom" ? 50 : 150,
          },
        }
      })
    )

    console.log("edges!")
    setEdges(
      snapshotNodes.flatMap((snapshotNode): RecoilEdge[] => {
        const value = snapshot.getLoadable(snapshotNode)
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)
        console.log("node!", JSON.stringify(info))
        console.log(info.deps)

        return Array.from(info.deps).map((dep) => ({
          id: `${snapshotNode.key}-${dep.key}`,
          source: dep.key,
          target: snapshotNode.key,
          animated: true,
        }))
      })
    )

    for (const node of snapshot.getNodes_UNSTABLE()) {
      console.debug(node.key, snapshot.getLoadable(node))
    }
  }, [snapshot])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Controls />
      </ReactFlow>
    </div>
  )
}
