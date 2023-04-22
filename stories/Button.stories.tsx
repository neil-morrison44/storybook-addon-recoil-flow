// prettier-ignore
import React from "react"
// prettier-ignore
import { ComponentStory, ComponentMeta } from "@storybook/react"
// prettier-ignore
import { withRecoilFlow } from "../dist/decorator"
// prettier-ignore
import { Button } from "./Button"
// prettier-ignore
import { RecoilRoot } from "recoil"
// prettier-ignore
import { AtomFour } from "./testRecoilThings"

// console.log("RV: ", React.version)

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  decorators: [
    withRecoilFlow,
    (storyFn) => (
      <RecoilRoot
        initializeState={({ set }) => {
          set(AtomFour, "test-hello")
        }}
      >
        {storyFn()}
      </RecoilRoot>
    ),
  ],
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: "Button",
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: "Button",
}

Secondary.parameters = {
  recoilFlow: {
    filter: {
      keys: ["AtomOne"],
      showConnected: true,
    },
  },
}

export const Large = Template.bind({})
Large.args = {
  size: "large",
  label: "Button",
}

Large.parameters = {
  recoilFlow: {
    filter: {
      keys: ["AtomOne", "AtomFour"],
      showConnected: false,
    },
  },
}

export const Small = Template.bind({})
Small.args = {
  size: "small",
  label: "Button",
}
