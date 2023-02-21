import type { ButtonProps as AriaButtonProps } from "ariakit/button";
import { Button as AriaButton } from "ariakit/button";
import { PropsWithChildren } from "react";

export function Button({
  children,
  ...props
}: PropsWithChildren<AriaButtonProps>) {
  return (
    <AriaButton
      {...props}
      className={`${props.className} focus:ring-width-2 appearance-none no-underline transform-gpu cursor-pointer select-none dark:hover:bg-dark-200 hover:bg-light-700 focus:ring-blue outline-0 focus:ring active:translate-y-px`}
    >
      {children}
    </AriaButton>
  );
}
