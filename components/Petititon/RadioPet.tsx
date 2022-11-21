import React from "react";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { FaCity, FaGlobeAfrica, FaWarehouse } from "react-icons/fa";


interface RadioPetProps {
    id: number,
    icon: React.ReactNode,
    text: String
  }
  
  const scales: RadioPetProps[] = [
    {
        id: 1,
      icon: <FaCity className="text-2xl"/>,
      text: "Ville"
    },
    {
        id: 1,
      icon: <FaWarehouse className="text-2xl"/>,
      text: "National"
    },
    {
        id: 3,
      icon: <FaGlobeAfrica className="text-2xl"/>,
      text: "International"
    }
  ]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RadioPet({icon, text}: RadioPetProps) {
  const [selectedScale, setSelectedScale] = useState(
    scales[0]
  );

  return (
    <RadioGroup value={selectedScale} onChange={setSelectedScale}>
      <RadioGroup.Label className="text-base font-medium text-gray-900">
        Selectionnez l&apos;échelle de votre pétition
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {scales.map((scale) => (
          <RadioGroup.Option
            key={scale.id}
            value={scale}
            className={({ checked, active }) =>
              classNames(
                checked ? "border-transparent" : "border-gray-300",
                active ? "border-green-400 ring-2 ring-green-400" : "",
                "relative flex cursor-pointer rounded-xl border bg-white p-4 shadow-sm focus:outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {scale.icon}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {scale.text}
                    </RadioGroup.Description>
                  </span>
                </span>
                <CheckCircleIcon
                  className={classNames(
                    !checked ? "invisible" : "",
                    "h-5 w-5 text-green-700"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-green-400" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
