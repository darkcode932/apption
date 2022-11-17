import ButtonClick from "../components/ButtonClick";
import Image from "next/image";
import Link from "next/link";
import { HiArrowCircleRight } from "react-icons/hi";
//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className="flex flex-col justify-center text-white mx-auto h-screen items-center space-y-10 xs:space-y-6 w-full bg-back1 bg-center">
      <p className="font-bold text-7xl xs:text-3xl">
        Bienvenue sur <span className="text-green-400">APPTION</span>{" "}
      </p>

      <p className="text-3xl font-thin xs:text-lg xs:text-center">
        Creer des petitions et influencer le cours de l&apos;histoire !
      </p>
      <Link href={'/login'}>
        <ButtonClick text='Démarrer' classArrow='text-2xl' classButton='rounded-xl bg-green-400 px-6 py-3' />
      </Link>
    </div>
  );
}
