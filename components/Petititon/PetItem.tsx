import React from 'react'
import Image from 'next/image'

export default function PetItem({text,link}) {
  return (
    <div className='flex flex-col space-y-4 items-center justify-center'>
        <Image width={400} height={300} className='w-[300px] h-[200px]' alt="ok" src={`${link}`}/>
        <p className='text-sm text-gray-700 text-center'>{text}</p>
    </div>
  )
}
