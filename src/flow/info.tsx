import { useMemo } from "react"
import { RecoilEdge, RecoilNode } from "../types"
import { css, jsx } from "@emotion/react"

const RecoilNodeList = ({
  nodes,
  onSelectNode,
}: {
  nodes: RecoilNode[]
  onSelectNode: (opts: { id: RecoilNode["id"] }) => void
}) => {
  return (
    <ul
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: auto;
        margin: 0;
        padding: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
      `}
    >
      {nodes.map((node) => (
        <li
          key={node.id}
          css={css`
            cursor: pointer;
            font-size: 1rem;
            word-break: break-all;
            display: flex;
            align-items: center;

            &::before {
              --size: 10px;
              content: "";
              width: var(--size);
              height: var(--size);
              border-radius: var(--size);
              background-color: ${node.fill};
              flex-shrink: 0;
              margin-right: 15px;
            }

            &:hover {
              text-decoration: underline;
            }
          `}
          onClick={() => onSelectNode({ id: node.id })}
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
  onSelectNode: (opts: { id: RecoilNode["id"] }) => void
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
      css={css`
        aspect-ratio: 1 / 1;
        background: white;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          font-size: 1.25rem;
          width: 100%;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 10px;
        `}
      >
        {selectedNode && (
          <div
            role="button"
            onClick={onClearNode}
            css={css`
              font-size: 0.875rem;
              opacity: 0.8;
              cursor: pointer;
              margin-bottom: 2px;
              &:hover {
                text-decoration: underline;
              }
            `}
          >
            {"< Atoms & Selectors"}
          </div>
        )}
        {selectedNode ? (
          <span
            css={css`
              word-break: break-all;
            `}
          >
            {`${selectedNode.data.type === "atom" ? "Atom" : "Selector"}: `}
            <b>{selectedNode.label}</b>
          </span>
        ) : (
          "Atoms & Selectors"
        )}
      </div>
      {!selectedNodeId && (
        <RecoilNodeList nodes={nodes} onSelectNode={onSelectNode} />
      )}
      {selectedNode && (
        <div
          css={css`
            padding: 12px;
            display: flex;
            flex-direction: column;
            overflow: auto;
            gap: 12px;
          `}
        >
          <pre
            css={css`
              border: 1px solid rgba(0, 0, 0, 0.4);
              border-radius: 10px;
              margin: 0;
              word-break: break-word;
              background: #2b2b2b;
              color: white;
            `}
          >
            {JSON.stringify(selectedNode.data.contents, null, 2)}
          </pre>
          <div>
            {selectedNode.data.lastUpdate < Infinity &&
              `Last changed ${selectedNode.data.lastUpdate} snapshots ago`}
            {selectedNode.data.lastUpdate >= Infinity &&
              `Has never changed value`}
          </div>
          <div>
            <b>{"Parents:"}</b>
            <RecoilNodeList
              nodes={selectedNodeConnections.parents}
              onSelectNode={onSelectNode}
            />
          </div>
          <div>
            <b>{"Children:"}</b>
            <RecoilNodeList
              nodes={selectedNodeConnections.children}
              onSelectNode={onSelectNode}
            />
          </div>
        </div>
      )}
    </div>
  )
}
