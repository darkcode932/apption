import React from "react";
import classNames from "classnames";

type InputType = "text" | "number" | "date" | "email" | "password" | "checkbox";
type InputSize = "checkbox" | "normal";
type IconPosition = "left" | "right";

const inputSizes = {
  checkbox: ["h-4", "w-4", "rounded", "border-neutral-800", "bg-neutral-950/50", "text-green-500", "focus:ring-green-500/30"],
  normal: [
    "block",
    "px-5",
    "w-full",
    "h-12",
    "border",
    "rounded-2xl",
    "text-sm",
    "bg-neutral-950/40",
    "text-white",
    "placeholder-neutral-500",
    "border-neutral-800",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-green-500/20",
    "focus:border-green-500",
    "transition-all",
    "duration-200",
  ],
};

interface InputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "size"
  > {
  type: InputType;
  inputSizeProp?: InputSize;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  block?: boolean;
  rightIcon?: React.ReactNode;
}

export function Input({
  type,
  inputSizeProp = "normal",
  icon,
  iconPosition,
  className,
  block = false,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <div
      className={classNames(
        "relative flex items-center w-full",
        { "w-full": block }
      )}
    >
      <input
        type={type}
        className={classNames(
          inputSizes[inputSizeProp],
          { "w-full": block },
          className
        )}
        {...props}
      />
      {rightIcon && (
        <span
          className={classNames(
            "flex items-center text-neutral-455 hover:text-green-400 text-neutral-450 justify-center absolute right-5 top-0 bottom-0 cursor-pointer z-10 transition-colors"
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}
