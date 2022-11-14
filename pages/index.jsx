import Head from 'next/head'
import Image from 'next/image'
import {HiArrowCircleRight} from 'react-icons/hi'
//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div class="flex flex-col justify-center text-white mx-auto h-screen items-center space-y-10 w-full bg-back1">
      <p class="font-bold text-7xl">Bienvenue sur <span class="text-green-400">APPTION</span> </p>
      <p class="text-3xl">Creer des petitions et influencer le cours de l&apos;histoire !</p>
      <button class="flex items-center space-x-1& text-white font-semibold rounded-xl bg-green-400 px-6 py-3">
        <span>Démarrer</span>
        <HiArrowCircleRight class="text-2xl"/>
      </button>
    </div>
  )
}
