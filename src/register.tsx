import React from "react"
import { addons, types } from "@storybook/addons"
import { AddonPanel } from "@storybook/components"
import { atom, RecoilRoot, selector, useRecoilValue } from "recoil"
import { FlowGraph } from "./flow/graph"

const ADDON_ID = "recoil-flow"
const PANEL_ID = `${ADDON_ID}/recoil-flow`

export const AtomOne = atom<string>({ default: "hello", key: "AtomOne" })
export const AtomTwo = atom<string>({ default: "hello", key: "AtomTwo" })
export const SelectorOne = selector<string>({
  key: "SelectorOne",
  get: ({ get }) => {
    const atomValue = get(AtomOne)
    const atomTwoValue = get(AtomTwo)
    return `${atomValue} ${atomTwoValue} selected!`
  },
})

export const AtomThree = atom<string>({ default: "hello", key: "AtomThree" })

export const SelectorTwo = selector<string>({
  key: "SelectorTwo",
  get: ({ get }) => {
    const atomValue = get(AtomThree)
    const selectorValue = get(SelectorOne)
    return `${atomValue} ${selectorValue} selected!`
  },
})

export const AtomFour = atom<string>({ default: "hello", key: "AtomFour" })

// give a unique name for the panel
const MyPanel = () => (
  <RecoilRoot>
    <FlowGraph />
  </RecoilRoot>
)

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Recoil Flow",
    render: ({ active, key }) => (
      <AddonPanel active={Boolean(active)} key={key}>
        <MyPanel />
      </AddonPanel>
    ),
  })
})
