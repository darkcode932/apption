import React from "react";
import ButtonClick from "../../ButtonClick";
import RadioPet from "../RadioPet";

interface StepProps {
  onSUbmit: (step: number) => void;
}

export default function StepOne({ onSUbmit }: StepProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-col space-y-4">
        <p className="font-bold text-4xl">
          Faites votre premier pas vers le changement
        </p>
        <RadioPet id={1} icon="" text="" />
      </div>
      <form className="flex flex-col">
        <div></div>
        <div className="flex justify-end">
          <ButtonClick
            text="Continuer"
            classArrow="text-xl"
            classButton="rounded-full bg-red-600 px-3 py-1 flex w-full justify-center border border-transparent w-36  py-2 px-4 shadow-sm "
            onClick={() => onSUbmit(1)}
          />
        </div>
      </form>
    </div>
  );
}
