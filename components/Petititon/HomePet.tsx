import React from 'react'
import Image from 'next/image'
import {UserGroupIcon, BanknotesIcon, UserIcon} from "@heroicons/react/24/outline"

function HomePet() {
  return (
    <div className='flex flex-col space-y-6 items-center justify-center'>
        <p className='font-semibold text-red-600 text-xl'>Meilleurs Pétitions</p>
        <div className='flex px-40 h-[305px]'>
          <Image width={400} height={200} alt="slide" src={'/assets/images/card.jpg'} className='w-1/2 h-full'/>
          <div className='w-1/2 bg-gray-500'>
            <div className='flex flex-col space-y-10 py-10 px-4'>
              <p className='font-bold text-xl text-center'>L&apos;ENSPD sera dotée de toilettes publiques</p>
              <p className='text-center'>Grâce à la collecte de 3500 signatures, les étudiants de l'&apos;ENSPD ont eu l&apos;approbation pour la création de toilettes publiques, ceci visant l'amélioration de la qualité de vie au sein de campus</p>
            </div>
            <hr />
            <div className='grid grid-cols-3 h-20 divide-x'>
            <div className='flex items-center justify-center space-x-2'>
                <UserIcon className='w-12 text-green-600' />
                <div className='flex-col'>
                  <p className='font-semibold text-sm'>Russel Atebede</p>
                  <p className='text-xs'>From Cameroon</p>
                </div>
              </div>
              <div className='flex items-center justify-center space-x-2'>
                <UserGroupIcon className='w-12 text-green-600' />
                <div className='flex-col'>
                  <p className='font-semibold text-sm'>3500</p>
                  <p className='text-xs'>Signataires</p>
                </div>
              </div>
              <div className='flex items-center justify-center space-x-2'>
                <BanknotesIcon className='w-12 text-green-600' />
                <div className='flex-col'>
                  <p className='font-semibold text-sm'>Sponsorisée</p>
                  <p className='text-xs'>Non</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default HomePet