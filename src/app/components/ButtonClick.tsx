import React from "react";
import { HiArrowCircleRight } from "react-icons/hi";

interface ButtonClickProps {
  text: string;
  classButton?: string;
  classArrow?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function ButtonClick({
  text,
  classButton = "",
  classArrow = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonClickProps) {
  return (
    <button
      className={`flex items-center space-x-2 text-white font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer ${classButton}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span>{text}</span>
      <HiArrowCircleRight className={`${classArrow}`} />
    </button>
  );
}
