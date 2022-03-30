import React, { ReactElement, useEffect, useState } from "react"
import ReactFlow, { MiniMap, Controls, Node, Edge } from "react-flow-renderer"
import { useRecoilSnapshot, useRecoilValue } from "recoil"
import { SelectorOne } from "../register"
import * as d3 from "d3"
import { SimulationNodeDatum } from "d3-force"

interface RecoilNode extends Node {
  data: {
    label: ReactElement
    contents: any
    type: "atom" | "selector"
  }
}
interface RecoilEdge extends Edge {}

interface RecoilSimulationNodeDatum extends SimulationNodeDatum {
  recoilNode: RecoilNode
}

const useRecoilNodesAndEdges = () => {
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

    setEdges(
      snapshotNodes.flatMap((snapshotNode): RecoilEdge[] => {
        const info = snapshot.getInfo_UNSTABLE(snapshotNode)
        const deps = Array.from(info.deps)
        const componentSubs = Array.from(info.subscribers.components)

        console.log({ componentSubs })

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

const useForceDirectedGraph = ({
  nodes,
  edges,
}: {
  nodes: RecoilNode[]
  edges: RecoilEdge[]
}): { nodes: RecoilNode[]; edges: RecoilEdge[]; firstRender: boolean } => {
  const [positionedNodes, setPositionedNodes] = useState<RecoilNode[]>([])
  const [firstRender, setFirstRender] = useState<boolean>(false)

  useEffect(() => {
    const simNodes: RecoilSimulationNodeDatum[] = nodes.map((node, index) => ({
      index,
      id: node.id,
      recoilNode: node,
      x: node.position.x,
      y: node.position.y,
    }))

    const sim = d3
      .forceSimulation<RecoilSimulationNodeDatum>(simNodes)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(500 / 2, 500 / 2))
      .force(
        "y",
        d3
          .forceY<RecoilSimulationNodeDatum>()
          .y(({ recoilNode }) => (recoilNode.data.type === "atom" ? -100 : 0))
          .strength(5)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => 100)
      )
      .force(
        "link",
        d3.forceLink().links(
          edges.map(({ source, target }) => ({
            source: simNodes.findIndex(
              ({ recoilNode }) => recoilNode.id === source
            ),
            target: simNodes.findIndex(
              ({ recoilNode }) => recoilNode.id === target
            ),
          }))
        )
      )
      .on("tick", () => {
        setPositionedNodes(
          simNodes.map(({ recoilNode, x, y }) => ({
            ...recoilNode,
            position: { x: x || 0, y: y || 0 },
          }))
        )
      })
      .on("end", () => {
        setFirstRender(true)
      })

    return () => {
      sim.stop()
    }
  }, [nodes, edges])

  return { edges, nodes: positionedNodes, firstRender }
}

export const FlowGraph = () => {
  const { nodes, edges } = useRecoilNodesAndEdges()
  const { nodes: pNodes, firstRender } = useForceDirectedGraph({ nodes, edges })
  useRecoilValue(SelectorOne)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {!firstRender && <div>{"Generating Graph..."}</div>}
      {firstRender && (
        <ReactFlow
          nodes={pNodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      )}
    </div>
  )
}
