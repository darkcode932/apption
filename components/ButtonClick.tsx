import React from 'react'
import { HiArrowCircleRight } from "react-icons/hi";

export default function ButtonClick({text, classButton, classArrow}) {
  return (
    <button className={`flex items-center space-x-1 text-white font-semibold ${classButton}`}>
          <span>{text}</span>
          <HiArrowCircleRight className={`${classArrow}`} />
    </button>
  )
}
