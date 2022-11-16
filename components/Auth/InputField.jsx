import React from 'react'

export default function InputField({nameI, typeI, idI, placeholderI, classInput}) {
  return (
    <div>
        <input
        type={typeI}
        name={nameI}
        id={idI}
        placeholder={placeholderI}
        className={`${classInput}`}
        required
      />
    </div>
  )
}
