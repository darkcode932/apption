import React from 'react'
import Image from 'next/image'

function HomePet() {
  return (
    <div className='flex flex-col space-y-6 items-center justify-center'>
        <p className='font-semibold text-red-600 text-xl'>Meilleurs Pétitions</p>
        <div className='flex px-40 '>
          <Image width={400} height={200} alt="slide" src={'/assets/images/card.jpg'} className='w-1/2 h-[302px]'/>
          <div className='w-1/2 bg-gray-500'>
            <div className='flex flex-col space-y-10 py-10 px-4'>
              <p className='font-bold text-xl text-center'>L&apos;ENSPD sera dotée de toilettes publiques</p>
              <p className='text-center'>Grâce à la collecte de 3500 signatures, les étudiants de l'&apos;ENSPD ont eu l&apos;approbation pour la création de toilettes publiques, ceci visant l'amélioration de la qualité de vie au sein de campus</p>
            </div>
            <hr />
            <div className='grid grid-cols-3 h-20 divide-x'>
              <div>ok</div>
              <div>ok</div>
              <div>ok</div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default HomePet