import React, { useEffect } from "react"
import { makeDecorator, useChannel, useCallback } from "@storybook/addons"
import { useRecoilNodesAndEdges } from "../hooks/useRecoilNodesAndEdges"
import { RecoilRoot } from "recoil"

const RecoilSnooper = ({ emit }: { emit: any }) => {
  const { edges, nodes } = useRecoilNodesAndEdges()

  useEffect(() => {
    emit("recoil-flow-changed", { nodes, edges })
  }, [edges, nodes])
  return null
}

export const withRecoilFlow = makeDecorator({
  name: "withRecoilFlow",
  parameterName: "recoilFlow",
  wrapper: (storyFn: any, {}, { parameters = {} }) => {
    const emit = useChannel({}, [])
    const emitCallback = useCallback((eventName: string, data: any) => {
      emit(eventName, data)
    }, [])

    return (
      <RecoilRoot override={false}>
        <RecoilSnooper emit={emitCallback} />
        {storyFn()}
      </RecoilRoot>
    )
  },
})
