import React from "react";
import ButtonClick from "../components/ButtonClick";
import {
  FaFacebook,
  FaGooglePlus,
} from "react-icons/fa";
import Link from "next/link";

function Login() {
  return (
    <div className="flex items-center justify-center bg-back2 bg-center bg-cover h-screen mx-auto w-full">
      <div className=" flex justify-between rounded-3xl space-x-10 pl-6 bg-back3 bg-cover bg-center w-[900px] h-[500px]">
        <div className="flex flex-col justify-center items-center w-2/3 space-y-4">
          <p className="font-bold text-4xl">
            <span className="text-green-400">Login </span>to your account
          </p>
          <p className="font-mono">Login using social networks</p>
          <div className="flex items-center space-x-2">
            <FaFacebook className="text-2xl" />
            <FaGooglePlus className="text-2xl" />
          </div>
          <div className="flex justify-between items-center">
            <hr className="w-full" />
            <span className="p-2 mb-1 text-sm font-bold text-red-600">OR</span>
            <hr className="w-full" />
          </div>
          <form className="flex flex-col items-center w-2/3 space-y-2">
            <input type="email" id="emailLog" placeholder="Ex: atebede@gmail.com" className="rounded-full w-full px-3 py-2 bg-green-100 placeholder:text-xs text-gray-500 outline-none" />
            <input type="password" id="passLog" placeholder="Password" className="rounded-full w-full px-3 py-2 bg-green-100 placeholder:text-xs text-gray-500 outline-none" />
            <Link href="/">
              <ButtonClick
                text="Sign In"
                classArrow="text-xl"
                classButton="rounded-full bg-red-600 px-3 py-1"
              />
            </Link>
          </form>
        </div>
        <div className="bg-back4 bg-cover bg-center rounded-2xl w-1/2 h-full text-white px-4 py-4">
          <p className="text-green-400 font-bold translate-x-64">APPTION</p>
          <div className="flex flex-col items-center text-center space-y-4 mt-28">
            <p className="font-bold text-4xl">New user ?</p>
            <p className="font-mono">
              Create your account and discover a new way to impact environment
            </p>
            <Link href="/">
              <ButtonClick
                text="Sign Up"
                classArrow="text-xl"
                classButton="rounded-full bg-green-400 px-3 py-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
