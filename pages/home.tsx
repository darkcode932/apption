import React from "react";
import Link from "next/link";
import ButtonClick from "../components/ButtonClick";
import PetItem from "../components/Petititon/PetItem";
import HomePet from "../components/Petititon/HomePet"

function Home() {
  return (
    <div>
      <div className="flex flex-col py-10 space-y-20">
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="flex-col items-center justify-center space-y-4 text-white mx-auto px-6 py-10 bg-back5 w-[1200px]">
            <p className="text-center text-4xl font-semibold">
              La Plateforme mondiale pour le changement, l&apos;influence de
              l'&apos;<span className="text-red-600">histoire</span>
            </p>
            <p className="text-center font-thin">
              300 000 personnes agisssent sur le destin{" "}
              <span className="text-red-600">chaque jour</span>
            </p>
          </div>
          <Link href={"/login"}>
            <ButtonClick
              text={"Lancer une petition"}
              classButton="rounded-xl bg-red-600 px-6 py-3"
              classArrow={"text-2xl"}
            />
          </Link>
        </div>
        <div>
            <HomePet />
        </div>
        <div className="flex items-center justify-center space-x-10">
          <PetItem
            text="Libération d'un prisonier à la prison de New-Bell"
            link="/assets/images/libération.jpg"
          />
          <PetItem
            text="Libération d'un prisonier à la prison de New-Bell"
            link="/assets/images/feuille.jpg"
          />
          <PetItem
            text="Libération d'un prisonier à la prison de New-Bell"
            link="/assets/images/limitation.jpg"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
