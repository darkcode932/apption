import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Profile from '../components/Dashboard/Profile'

function Dashboard() {
  return (
    <>
      <Head>
        <title>Tableau de bord | Change</title>
      </Head>
      <div className="flex space-x-4 xs:flex-col xs:space-x-0 xs:space-y-4">
        <div className="flex px-4 py-10 flex-col w-1/3 xs:w-full sm:w-1/3">
          <div>
            <Profile />
          </div>
          <div className="mt-8">
            <div className="">
              <div className="flex">
                <span className="text-xl font-semibold">Votre Petition</span>
              </div>
              {/* <div>
                <span className="text-sm">Le capital global du marché des crypto est <span className="font-semibold">$2.19T</span></span>
              </div>   */}
            </div>
            <div className="p-4 bg-gray-50 my-3 rounded-xl">
              
            </div>
          </div>
        </div>
        {/* <div className="diveder border border-black bg-black w-0 xs:hidden"></div> */}
        <div className="flex flex-col py-10 w-3/4 px-4 xs:w-full sm:w-full bg-gray-50">
          <div className="flex justify-between xs:flex-col xs:space-y-4">
            <div className="w-1/2 xs:w-full shadow-grey-5 rounded-lg">
              
            </div>
            <div className="w-1/2 flex justify-end drop-shadow-md shadow-grey-5 rounded-lg xs:w-full">
              
            </div>
          </div>
          <div className="mt-12 bg-white p-4 shadow-grey-5 rounded-lg">
            <div className="xs:text-center">
              <p className="text-xl font-semibold">
                Paramètres de la pétition
              </p>
            </div>
            <div className="h-96 overflow-auto scrollbar-hidden">
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard