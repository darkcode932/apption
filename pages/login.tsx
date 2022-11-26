import React from "react";
import {useState} from 'react'
import ButtonClick from "../components/ButtonClick";
//import { isEmpty } from "lodash";
//import AuthError from "../components/Auth/Error";
import { Input } from "../components/Auth/Input";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {

  const [_passwordShow, setPasswordShow] = useState<boolean>(false);
  //const [_error, setError] = useState<string>();

  const handleSetPasswordShow = () => {
    setPasswordShow(!_passwordShow);
  };


  return (
    <div className="flex items-center justify-center bg-back2 bg-center bg-cover h-screen mx-auto w-full">
      <div className=" flex justify-between rounded-3xl space-x-10 pl-6 bg-back3 bg-cover bg-center shadow w-[900px] h-[500px]">
        <div className="flex min-h-full w-2/3 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Link
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              <div>
                <Link
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Twitter</span>
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>

              <div>
                <Link
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="font-semibold px-2 text-black">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="py-8 px-4 sm:rounded-lg sm:px-10">
              <form className="space-y-6" method='POST' action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="exemple@fomain.io"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm mb-2 font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Input
                    type={_passwordShow ? "text" : "password"}
                    iconPosition="right"
                    name="password"
                    id="password"
                    block
                    rightIcon={
                      _passwordShow ? (
                        <EyeIcon
                          height={18}
                          onClick={() => handleSetPasswordShow()}
                        />
                      ) : (
                        <EyeSlashIcon
                          height={18}
                          onClick={() => handleSetPasswordShow()}
                        />
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-green-400"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-red-600 hover:text-green-400"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <ButtonClick
                    text="Sign Up"
                    classArrow="text-xl"
                    classButton="rounded-full bg-red-600 px-3 py-1 flex w-full justify-center border border-transparent  py-2 px-4 shadow-sm "
                  />
                </div>
              </form>
            </div>
          </div>
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
