import React from "react";
import Image from "next/image";
import {HiPlusCircle, HiOutlineChevronRight} from 'react-icons/hi'

const Profile = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="w-20 rounded-full ring ring-green-400 ring-offset-gray-300 ring-offset-4">
          <div className="relative inline-block">
            <img
              className="inline-block object-cover w-20 h-20 rounded-full"
              src="https://picsum.photos/200"
              alt="Profile image"
            />
            <span className="absolute bottom-0 right-0 inline-block w-3 h-3 bg-black border-2 border-white rounded-full"></span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-gray">Okokbatonmanioc</span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-4 px-4 py-3 my-4 border rounded-xl border-green-400 cursor-pointer hover:bg-green-200">
        <HiPlusCircle className="text-green-400 text-xl"/>
        <span className="text-sm">Nouvelle Pétiiton</span>
        <HiOutlineChevronRight className="text-green-400"/>
      </div>
    </div>
  );
};

export default Profile;