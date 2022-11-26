import { isNil } from "lodash";

var classNames = require("classnames");

type InputType = "text" | "number" | "date" | "email" | "password" | "checkbox";
type InputSize = "checkbox" | "normal";
type IconPosition = "left" | "right";
const inputSize = {
  checkbox: ["h-4", "w-4"],
  normal: [
    "block",
    "px-4",
    "w-full",
    "h-12",
    "border",
    "rounded-full",
    "sm:text-sm",
    "cursor-default",
    "focus:outline-none",
    "focus:ring-1",
    "focus:ring-green-400",
    "focus:border-green-400",
    "blur:border-green-400",
  ],
};

const iconPosit = {
  left: [
    "absolute",
    "inset-y-0",
    "left-0",
    "pl-3",
    "flex",
    "items-center",
    "pointer-events-none",
  ],
  right: [
    "absolute",
    "inset-y-0",
    "right-0",
    "pr-3",
    "flex",
    "items-center",
    "pointer-events-none",
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
  size: InputSize;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  className?: string;
  block?: boolean;
  rightIcon?: React.ReactNode;
}

export function Input({
  type,
  size,
  icon,
  iconPosition,
  className,
  block,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <div
      className={classNames(
        "relative flex items-center",
        { "w-full": block },
        { "justify-end": !isNil(rightIcon) }
      )}
    >
      <input
        title="Input"
        type={type}
        className={classNames(
          `text-gray-700 border bg-gray-200 placeholder-gray-400 border-gray-300 focus:outline-none sm:text-sm cursor-pointer`,
          inputSize[size!],
          { "w-full": block },
          className
        )}
        {...props}
      />
      {rightIcon && (
        <span
          className={classNames(
            "flex items-center text-gray-500 justify-center absolute top-0 bottom-0 pr-3"
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}

Input.defaultProps = {
  type: "text",
  size: "normal",
};