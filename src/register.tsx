import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { addons, types } from "@storybook/addons"
import { AddonPanel } from "@storybook/components"
import { eightenRootedFlow } from "./sixteenEighteenShim"
import { useChannel } from "@storybook/api"
import { RecoilEdge, RecoilNode } from "./types"

// console.log("RV:", React.version)

const ADDON_ID = "recoil-flow"
const PANEL_ID = `${ADDON_ID}/recoil-flow`

const FlowAddonPanel = ({ active }: { active: Boolean }) => {
  const divRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    window.postMessage({ name: "recoil-flow-changed", ...nodesAndEdges }, "*")
  }, [nodesAndEdges])

  useLayoutEffect(() => {
    if (!active) return
    if (!divRef.current) throw new Error("No div to render into")
    const root = eightenRootedFlow(divRef.current)

    window.setTimeout(() => {
      window.postMessage({ name: "recoil-flow-changed", ...nodesAndEdges }, "*")
    }, 0)
    return () => {
      root.unmount()
    }
  }, [active])

  return (
    <AddonPanel active={Boolean(active)}>
      <div ref={divRef} style={{ display: "contents" }} />
    </AddonPanel>
  )
}

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Recoil Flow",
    render: ({ active, key }) => (
      <FlowAddonPanel active={Boolean(active)} key={key} />
    ),
  })
})
