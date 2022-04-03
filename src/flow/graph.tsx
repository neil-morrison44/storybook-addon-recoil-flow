import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import ReactFlow, { MiniMap, Controls, Node, Edge } from "react-flow-renderer"
import { useChannel } from "@storybook/api"
import * as d3 from "d3"
import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force"

interface RecoilNode extends Node {
  data: {
    label: ReactElement
    contents: any
    type: "atom" | "selector"
  }
}

type RecoilNodeWithoutPosition = Omit<RecoilNode, "position">

interface RecoilEdge extends Edge {}

interface RecoilSimulationNodeDatum extends SimulationNodeDatum {
  recoilNode: RecoilNodeWithoutPosition
}

const useForceDirectedGraph = ({
  nodes,
  edges,
}: {
  nodes: RecoilNodeWithoutPosition[]
  edges: RecoilEdge[]
}): { nodes: RecoilNode[]; edges: RecoilEdge[]; firstRender: boolean } => {
  const [positionedNodes, setPositionedNodes] = useState<RecoilNode[]>([])
  const [firstRender, setFirstRender] = useState<boolean>(false)
  const simNodeMapRef = useRef<{ [k: string]: RecoilSimulationNodeDatum }>({})

  const simNodes: RecoilSimulationNodeDatum[] = useMemo(
    () =>
      nodes.map((node, index) => {
        if (simNodeMapRef.current[node.id]) {
          simNodeMapRef.current[node.id].recoilNode = node
          return simNodeMapRef.current[node.id]
        }

        return (simNodeMapRef.current[node.id] = {
          index,
          recoilNode: node,
          x: 0,
          y: 0,
        })
      }),
    [nodes]
  )

  const fakeFamilyLinks: SimulationLinkDatum<RecoilSimulationNodeDatum>[] =
    useMemo(() => {
      const familyGroups: { [k: string]: RecoilSimulationNodeDatum[] } =
        simNodes.reduce((groups, node) => {
          if (!node.recoilNode.id.includes("__")) return []
          const [familyName] = node.recoilNode.id.split("__")
          groups[familyName] ||= []
          groups[familyName].push(node)

          return groups
        }, {}) || {}

      const fakeLinks = Object.entries(familyGroups)
        .map(([familyName, nodes]) =>
          nodes.flatMap((source) =>
            nodes
              .filter((target) => target !== source)
              .map((target) => ({
                source: source.index || 0,
                target: target.index || 0,
              }))
          )
        )
        .flat()
      return fakeLinks
    }, [simNodes])

  useEffect(() => {
    const sim = d3
      .forceSimulation<RecoilSimulationNodeDatum>(simNodes)
      .force("charge", d3.forceManyBody().strength(2))
      .force("center", d3.forceCenter(500 / 2, 500 / 2).strength(1.5))
      .force(
        "y",
        d3
          .forceY<RecoilSimulationNodeDatum>()
          .y(({ recoilNode }) => (recoilNode.data.type === "atom" ? -100 : 0))
          .strength(0.5)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => 100)
      )
      .force(
        "link",
        d3.forceLink().links([
          ...fakeFamilyLinks,
          ...edges.map(({ source, target }) => ({
            source: simNodes.findIndex(
              ({ recoilNode }) => recoilNode.id === source
            ),
            target: simNodes.findIndex(
              ({ recoilNode }) => recoilNode.id === target
            ),
          })),
        ])
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

const useRemoteRecoilNodesAndEdges = () => {
  const [nodes, setNodes] = useState<RecoilNodeWithoutPosition[]>([])
  const [edges, setEdges] = useState<RecoilEdge[]>([])

  useChannel(
    {
      "recoil-flow-changed": ({
        nodes: n,
        edges: e,
      }: {
        nodes: RecoilNodeWithoutPosition[]
        edges: RecoilEdge[]
      }) => {
        setNodes(n)
        setEdges(e)
      },
    },
    []
  )

  return { nodes, edges }
}

export const FlowGraph = () => {
  const { nodes, edges } = useRemoteRecoilNodesAndEdges()
  const { nodes: pNodes, firstRender } = useForceDirectedGraph({ nodes, edges })
  // useRecoilValue(SelectorOne)

  // useRecoilValue(AtomFamilyOne("key-two"))

  // const setNew = useRecoilCallback(
  //   ({ set }) =>
  //     () => {
  //       set(AtomFamilyOne("key"), "New Value!")
  //     },
  //   []
  // )

  // useEffect(() => {
  //   setTimeout(() => {
  //     setNew()
  //   }, 20 * 1000)
  // }, [])

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
          <MiniMap />
        </ReactFlow>
      )}
    </div>
  )
}
