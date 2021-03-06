import { useCallback, useRef, useState } from "react"
import { useChannel } from "@storybook/api"
import {
  GraphCanvas,
  GraphCanvasRef,
  GraphNode,
  lightTheme,
  useSelection,
} from "reagraph"
import { RecoilEdge, RecoilNode } from "../types"
import { FlowInfo } from "./info"
import { usePanelPosition } from "../hooks/usePanelPosition"
import { css, jsx } from "@emotion/react"

const RECOIL_BLUE = "#5a91ea"

const useRemoteRecoilNodesAndEdges = () => {
  const [nodesAndEdges, setNodesAndEdges] = useState<{
    nodes: RecoilNode[]
    edges: RecoilEdge[]
  }>({ nodes: [], edges: [] })

  useChannel(
    {
      "recoil-flow-changed": ({
        nodes,
        edges,
      }: {
        nodes: RecoilNode[]
        edges: RecoilEdge[]
      }) => {
        setNodesAndEdges({
          nodes,
          edges,
        })
      },
    },
    []
  )

  return nodesAndEdges
}

export const FlowGraph = () => {
  const { nodes, edges } = useRemoteRecoilNodesAndEdges()
  const graphRef = useRef<GraphCanvasRef | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const panelPosition = usePanelPosition()

  const onNodeClick = useCallback(({ id }: { id: string }) => {
    setSelectedNode(id)
    graphRef.current?.centerGraph([id])
  }, [])

  const onCanvasClick = useCallback(() => {
    setSelectedNode(null)
    graphRef.current?.centerGraph([])
  }, [])

  const noData = nodes.length + edges.length === 0
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        gap: 1px;
        background: rgba(0, 0, 0, 0.1);
        flex-direction: ${panelPosition === "bottom" ? "row" : "column"};
      `}
    >
      {noData && <div>{"No Recoil Nodes found"}</div>}
      <div style={{ flexGrow: 1, position: "relative" }}>
        <GraphCanvas
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          cameraMode="rotate"
          layoutType="treeTd3d"
          onNodeClick={onNodeClick}
          onCanvasClick={onCanvasClick}
          selections={selectedNode ? [selectedNode] : []}
          theme={{
            ...lightTheme,
            node: {
              ...lightTheme.node,
              activeFill: RECOIL_BLUE,
              label: {
                ...lightTheme.node.label,
                color: RECOIL_BLUE,
                activeColor: RECOIL_BLUE,
              },
            },
            ring: {
              ...lightTheme.ring,
              activeFill: RECOIL_BLUE,
              fill: RECOIL_BLUE,
            },
            edge: {
              ...lightTheme.edge,
              activeFill: RECOIL_BLUE,
              label: {
                ...lightTheme.edge.label,
                color: RECOIL_BLUE,
                activeColor: RECOIL_BLUE,
              },
            },
            arrow: {
              ...lightTheme.arrow,
              activeFill: RECOIL_BLUE,
            },
          }}
        />
      </div>
      <FlowInfo
        nodes={nodes}
        edges={edges}
        selectedNodeId={selectedNode}
        onSelectNode={onNodeClick}
        onClearNode={onCanvasClick}
      ></FlowInfo>
    </div>
  )
}
