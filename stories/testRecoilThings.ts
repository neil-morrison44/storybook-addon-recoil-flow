import { atom, selector, atomFamily } from "recoil"

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

export const AtomFamilyOne = atomFamily({
  key: "AtomFamilyOne",
  default: "world",
})
