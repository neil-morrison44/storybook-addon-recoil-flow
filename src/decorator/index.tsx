import React, { useEffect } from "react"
import { makeDecorator, useChannel, useCallback } from "@storybook/preview-api"
import { useRecoilNodesAndEdges } from "../hooks/useRecoilNodesAndEdges"
import { RecoilRoot } from "recoil"

const RecoilSnooper = ({
  emit,
  allowedKeys,
  showConnected,
}: {
  emit: any
  allowedKeys: string[]
  showConnected: boolean
}) => {
  const { edges, nodes } = useRecoilNodesAndEdges()
  let filteredNodes = [...nodes]
  if (allowedKeys.length > 0)
    filteredNodes = nodes.filter(({ id }) =>
      allowedKeys.some((k) => id.startsWith(k))
    )

  if (allowedKeys && showConnected) {
    const connectedNodes = new Set<typeof nodes[0]>()
    do {
      filteredNodes.push(...Array.from(connectedNodes))
      const filteredNodeKeys = filteredNodes.map(({ id }) => id)
      connectedNodes.clear()

      edges.forEach(({ source, target }) => {
        const sourceKnown = filteredNodeKeys.includes(source)
        const targetKnown = filteredNodeKeys.includes(target)
        if (sourceKnown !== targetKnown) {
          const targetNode = nodes.find(({ id }) => id === target)
          const sourceNode = nodes.find(({ id }) => id === source)

          if (sourceKnown && targetNode) connectedNodes.add(targetNode)
          if (targetKnown && sourceNode) connectedNodes.add(sourceNode)
        }
      })
    } while (connectedNodes.size > 0)
  }

  useEffect(() => {
    emit("recoil-flow-changed", { nodes: filteredNodes, edges })
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
    const allowedKeys = parameters.filter?.keys || []
    const showConnected = parameters.filter?.showConnected ?? true

    return (
      <RecoilRoot override={false}>
        <RecoilSnooper
          emit={emitCallback}
          allowedKeys={allowedKeys}
          showConnected={showConnected}
        />
        {storyFn()}
      </RecoilRoot>
    )
  },
})
