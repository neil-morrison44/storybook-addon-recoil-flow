# storybook-addon-recoil-flow

Adds a panel to monitor the entire state of recoil for your story.

![Recoil Flow Logo](/images/logo.png)

## Setup

### Method 1: The Recoil Root is provided by another decorator addon

The addon can be installed by just installing via npm / yarn then adding `"storybook-addon-recoil-flow"` to the `addons` array in `./storybook/main.js`.
Ensure that this addon & whichever one is providing the RecoilRoot are in the correct order.

### Method 2: The Recoil Root is provided by a decorator within the story

- Install via npm / yarn
- Add `storybook-addon-recoil-flow/dist/register` to the addons array
- Import `withRecoilFlow` from `storybook-addon-recoil-flow/dist/decorator` within your story and put it into the `decorators` array (in the right order)

### Method 3: Just use the `RecoilRoot` provided by the decorator

- Install via npm / yarn
- The decorator provides a `RecoilRoot` with `overrides` set to false so the method in 1 will work without another decorator (but you'll not be able to set up a custom initialiser)

![Screenshot](/images/screenshot.png)
