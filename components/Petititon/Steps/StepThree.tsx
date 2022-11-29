import Link from "next/link";
import React from "react";
import ButtonClick from "../../ButtonClick";

interface StepProps {
  onSUbmit: (step: number) => void;
}

export default function StepThree({ onSUbmit }: StepProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-col space-y-4">
        <p className="font-bold text-4xl text-center">
          Donnez un titre à votre Pétition, Ajouter une Photo(Optionnel) et
          dites nous en plus
        </p>
        <p>
          Entrez un titre qui exprime clairemaent le changement que vous
          souhaitez obtenir
        </p>
      </div>
      <form className="flex-col space-y-4">
        <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-400">
          <label
            htmlFor="title"
            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Titre de la pétition
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-0 sm:text-sm"
            placeholder="Rendons sa liberté à Onomo"
          />
        </div>
        <p>
          Expliquez le problème qui vous tiens à coeur et pourquoi il vous tient
          à coeur. En montrant l&apos;impact qu'il aura qu&apos;il aura sur vous
          et la communauté
        </p>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Ajouter votre description
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              name="comment"
              id="comment"
              className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm bg-gray-100 focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-400 outline-none sm:text-sm"
              defaultValue={""}
            />
          </div>
        </div>
        <p>
          Parce qu&apos;une image vaut mille mots, permettez à votre audience
          d'&apos;avoir une meilleure visualisation de la situation ou du
          problème que vous souhaitez mettre en avant.
        </p>
        <div className="hover:cursor-pointer">
          <label className="block text-sm font-medium text-gray-700">
            Photo d'&apos;appui
          </label>
          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-green-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-300 focus-within:ring-offset-2 hover:text-green-300"
                >
                  <span>Charger une photo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">ou glisser la photo sur la surface</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF taille maximum 10Mo
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <ButtonClick
            text="Retour"
            classArrow="text-xl"
            classButton="rounded-full bg-gray-400 px-3 w-36 py-1 flex w-full justify-center border border-transparent  py-2 px-4 shadow-sm "
            onClick={() => onSUbmit(1)}
          />
          <Link href={"/login"}>
            <ButtonClick
              text="Terminer"
              classArrow="text-xl"
              classButton="rounded-full bg-red-600 px-3 py-1 w-36 flex w-full justify-center border border-transparent  py-2 px-4 shadow-sm "
              onClick={() => onSUbmit(3)}
            />
          </Link>
        </div>
      </form>
    </div>
  );
}
