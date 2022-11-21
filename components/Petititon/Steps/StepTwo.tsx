import React from "react";
import ButtonClick from "../../ButtonClick";
import RadioPetTwo from "../RadioPetTwo";

interface StepProps {
  onSUbmit: (step: number) => void;
}

export default function StepTwo({ onSUbmit }: StepProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-col space-y-4">
        <p className="font-bold text-4xl">Quelle est la Thématique mise en avant par votre Pétition ?</p>
        <RadioPetTwo id={1} name=""/>
      </div>
      <form>
        <div></div>
        <div className="flex justify-end space-x-4">
          <ButtonClick
            text="Retour"
            classArrow="text-xl"
            classButton="rounded-full bg-gray-400 px-3 py-1 w-36 flex w-full justify-center border border-transparent  py-2 px-4 shadow-sm "
            onClick={() => onSUbmit(0)}
          />
          <ButtonClick
            text="Continuer"
            classArrow="text-xl"
            classButton="rounded-full bg-red-600 px-3 py-1 w-36 flex w-full justify-center border border-transparent  py-2 px-4 shadow-sm "
            onClick={() => onSUbmit(2)}
          />
        </div>
      </form>
    </div>
  );
}
