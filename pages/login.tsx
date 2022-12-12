import React from "react";
import { useState } from "react";
import ButtonClick from "../components/ButtonClick";
import {handleEmailSignIn} from '../config/firebase'
//import { isEmpty } from "lodash";
//import AuthError from "../components/Auth/Error";
import { Input } from "../components/Auth/Input";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [_passwordShow, setPasswordShow] = useState<boolean>(false);
  //const [_error, setError] = useState<string>();

  const handleSetPasswordShow = () => {
    setPasswordShow(!_passwordShow);
  };

  const handleSignIn = (email, password) => {
    handleEmailSignIn(email, password);
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
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#3B5998"
                      fill-rule="evenodd"
                      d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6845806,22"
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
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#1DA1F2"
                      fill-rule="evenodd"
                      d="M24,4.3086 C23.117,4.7006 22.168,4.9646 21.172,5.0836 C22.188,4.4746 22.969,3.5096 23.337,2.3596 C22.386,2.9246 21.332,3.3336 20.21,3.5556 C19.312,2.5976 18.032,1.9996 16.616,1.9996 C13.897,1.9996 11.692,4.2046 11.692,6.9236 C11.692,7.3096 11.736,7.6856 11.82,8.0456 C7.728,7.8406 4.099,5.8806 1.671,2.9006 C1.247,3.6286 1.004,4.4736 1.004,5.3766 C1.004,7.0846 1.873,8.5926 3.195,9.4756 C2.388,9.4486 1.628,9.2276 0.964,8.8596 L0.964,8.9206 C0.964,11.3066 2.661,13.2966 4.914,13.7486 C4.501,13.8626 4.065,13.9216 3.617,13.9216 C3.299,13.9216 2.991,13.8906 2.69,13.8336 C3.317,15.7896 5.135,17.2136 7.29,17.2536 C5.604,18.5736 3.481,19.3606 1.175,19.3606 C0.777,19.3606 0.385,19.3376 0,19.2926 C2.179,20.6886 4.767,21.5046 7.548,21.5046 C16.605,21.5046 21.557,14.0016 21.557,7.4946 C21.557,7.2816 21.552,7.0696 21.543,6.8586 C22.505,6.1636 23.34,5.2966 24,4.3086"
                    />
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
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#EA4335 "
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
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
              <form className="space-y-6" method="POST" action="#">
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
                          className="cursor-pointer"
                          height={18}
                          onClick={() => handleSetPasswordShow()}
                        />
                      ) : (
                        <EyeSlashIcon
                          className="cursor-pointer"
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
                    onClick={() => handleSignIn(email, password)}
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
            <Link href="/register">
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
