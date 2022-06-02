import React, { useMemo } from "react"
import { RecoilEdge, RecoilNode } from "../types"

const RecoilNodeList = ({
  nodes,
  onSelectNode,
}: {
  nodes: RecoilNode[]
  onSelectNode: (id: RecoilNode["id"]) => void
}) => {
  return (
    <ul
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        overflow: "auto",
      }}
    >
      {nodes.map((node) => (
        <li
          key={node.id}
          style={{
            cursor: "pointer",
            fontSize: "1rem",
            wordBreak: "break-all",
          }}
          onClick={() => onSelectNode(node.id)}
        >
          {node.label} {`(${node.data.type})`}
        </li>
      ))}
    </ul>
  )
}

export const FlowInfo = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onClearNode,
}: {
  nodes: RecoilNode[]
  edges: RecoilEdge[]
  selectedNodeId?: RecoilNode["id"] | null
  onSelectNode: (id: RecoilNode["id"]) => void
  onClearNode: () => void
}) => {
  const selectedNode = useMemo(
    () => nodes.find(({ id }) => id === selectedNodeId),
    [selectedNodeId, nodes]
  )

  const selectedNodeConnections = useMemo<{
    parents: RecoilNode[]
    children: RecoilNode[]
  }>(() => {
    if (!selectedNode) return { parents: [], children: [] }

    return {
      parents: edges
        .filter(({ target }) => target === selectedNode.id)
        .flatMap(({ source }) => {
          const sourceNode = nodes.find(({ id }) => id === source)
          return sourceNode ? [sourceNode] : []
        }),
      children: edges
        .filter(({ source }) => source === selectedNode.id)
        .flatMap(({ target }) => {
          const targetNode = nodes.find(({ id }) => id === target)
          return targetNode ? [targetNode] : []
        }),
    }
  }, [selectedNode])

  return (
    <div
      style={{
        aspectRatio: "1 / 1",
        background: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: "1.5rem",
          width: "100%",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          padding: "10px",
        }}
      >
        {selectedNode && (
          <div
            role="button"
            onClick={onClearNode}
            style={{ fontSize: "0.875rem", opacity: 0.8, cursor: "pointer" }}
          >
            {"< Atoms & Selectors"}
          </div>
        )}
        {selectedNode
          ? `${selectedNode.data.type === "atom" ? "Atom" : "Selector"} Details`
          : "Atoms & Selectors"}
      </div>
      {!selectedNodeId && (
        <RecoilNodeList nodes={nodes} onSelectNode={onSelectNode} />
      )}
      {selectedNode && (
        <div
          style={{
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            gap: "12px",
          }}
        >
          <h2
            style={{
              minWidth: "80%",
              paddingBottom: "4px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              wordBreak: "break-word",
            }}
          >
            {selectedNode.label}
          </h2>
          <div>
            <pre
              style={{
                border: "1px solid rgba(0,0,0,0.4)",
                borderRadius: 10,
                marginTop: "5px",
                wordBreak: "break-word",
              }}
            >
              {JSON.stringify(selectedNode.data.contents, null, 2)}
            </pre>
          </div>
          {selectedNodeConnections.parents.length > 0 && (
            <div>
              <b>{"Parents:"}</b>
              <RecoilNodeList
                nodes={selectedNodeConnections.parents}
                onSelectNode={onSelectNode}
              />
            </div>
          )}
          {selectedNodeConnections.children.length > 0 && (
            <div>
              <b>{"Children:"}</b>
              <RecoilNodeList
                nodes={selectedNodeConnections.children}
                onSelectNode={onSelectNode}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
