import React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import "./button.css"
import { AtomOne, SelectorOne, SelectorTwo } from "./testRecoilThings"

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large"
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary"

  useRecoilValue(SelectorOne)
  useRecoilValue(SelectorTwo)

  const increaseHelloCount = useSetRecoilState(AtomOne)

  return (
    <button
      type="button"
      className={["storybook-button", `storybook-button--${size}`, mode].join(
        " "
      )}
      style={{ backgroundColor }}
      {...props}
      onClick={() => {
        increaseHelloCount((current) => `${current}, Hello`)
        props.onClick?.()
      }}
    >
      {label}
    </button>
  )
}
