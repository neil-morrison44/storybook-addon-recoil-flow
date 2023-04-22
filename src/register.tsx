import React from "react"
import { addons, types } from "@storybook/addons"
import { AddonPanel } from "@storybook/components"
import { FlowGraph } from "./flow/graph"

console.log("RV:", React.version)

const ADDON_ID = "recoil-flow"
const PANEL_ID = `${ADDON_ID}/recoil-flow`

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Recoil Flow",
    render: ({ active, key }) => (
      <AddonPanel active={Boolean(active)} key={key}>
        <FlowGraph />
      </AddonPanel>
    ),
  })
})
