import React from 'react'
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

interface RadioPetTwoProps {
    id: number,
    name: String
  }

  const categories: RadioPetTwoProps[] = [
    {
        id: 1,
        name: "Politique"
    },
    {
        id: 2,
        name: "Education"
    },
    {
        id: 3,
        name: "Sport"
    },
    {
        id: 4,
        name: "Art"
    },
    {
        id: 5,
        name: "Santé"
    },
    {
        id: 6,
        name: "Droits de l'homme"
    },
    {
        id: 7,
        name: "Autres..."
    },

  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function RadioPetTwo({id,name}: RadioPetTwoProps) {

    const [cat, setCat] = useState(categories[2])
  return (
    <RadioGroup value={cat} onChange={setCat} className="mt-2">
        <RadioGroup.Label className="text-base font-medium text-gray-900"> Sélectionnez une categorie </RadioGroup.Label>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6 hover:cursor-pointer">
          {categories.map((category) => (
            <RadioGroup.Option
              key={category.id}
              value={category.name}
              className={({ active, checked }) =>
                classNames(
                  active ? 'ring-2 ring-offset-2 ring-green-500' : '',
                  checked
                    ? 'bg-green-600 border-transparent text-white hover:bg-green-700'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                  'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
                )
              }
            >
              <RadioGroup.Label as="span">{category.name}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
  )
}
