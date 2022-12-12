import React from "react";
import { useState } from "react";
import {handleEmailSignUp} from '../config/firebase'
import { Input } from "../components/Auth/Input";
import Link from "next/link";
import ButtonClick from "../components/ButtonClick";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Register() {
  const [_passwordShown, setPasswordShown] = useState<boolean>(false);

  const handleSetPasswordShown = () => {
    setPasswordShown(!_passwordShown);
  };

  const [_cpasswordShown, setCPasswordShown] = useState<boolean>(false);

  const handleSetCPasswordShown = () => {
    setCPasswordShown(!_cpasswordShown);
  };

  const handleSignUp = (email, password) => {
    handleEmailSignUp(email, password)
  }

  return (
    <div className="flex items-center justify-center bg-back6 bg-center bg-cover h-screen mx-auto w-full">
      <div className="flex-col bg-back7 bg-center bg-cover px-24 py-6 rounded-2xl text-white">
        <div className="flex-col justify-center text-center space-y-4 mb-4">
          <p className="font-bold text-4xl">
            Create your account
            <br /> right now <span className="text-red-600">!</span>
          </p>
          <p className="font-thin text-sm">
            Fill in this form to create an account on our platform <br /> and
            start giving your own influence on life events
          </p>
        </div>
        <form className="space-y-4" method="POST" action="#">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Firstname
            </label>
            <Input
              type="text"
              name="firstname"
              id="fn"
              placeholder="Mebina Mebina"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Lastname
            </label>
            <Input
              type="text"
              name="lastname"
              id="ln"
              placeholder="Dieudonnée"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Username
            </label>
            <Input
              type="text"
              name="username"
              id="user"
              placeholder="Okokbatonmanioc99"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Email
            </label>
            <Input
              type="email"
              name="emailR"
              id="emailR"
              placeholder="exemple@fomain.io"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 font-medium text-white"
            >
              Enter Password
            </label>
            <Input
              type={_passwordShown ? "text" : "password"}
              iconPosition="right"
              name="password"
              id="password"
              block
              rightIcon={
                _passwordShown ? (
                  <EyeIcon
                    className="cursor-pointer"
                    height={18}
                    onClick={() => handleSetPasswordShown()}
                  />
                ) : (
                  <EyeSlashIcon
                    className="cursor-pointer"
                    height={18}
                    onClick={() => handleSetPasswordShown()}
                  />
                )
              }
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 font-medium text-white"
            >
              Confirm Password
            </label>
            <Input
              type={_cpasswordShown ? "text" : "password"}
              iconPosition="right"
              name="password"
              id="password"
              block
              rightIcon={
                _cpasswordShown ? (
                  <EyeIcon
                    className="cursor-pointer"
                    height={18}
                    onClick={() => handleSetCPasswordShown()}
                  />
                ) : (
                  <EyeSlashIcon
                    className="cursor-pointer"
                    height={18}
                    onClick={() => handleSetCPasswordShown()}
                  />
                )
              }
            />
          </div>
          <ButtonClick
            text="Register"
            classArrow="text-xl"
            classButton="rounded-full bg-green-400 px-3 py-1 flex w-full justify-center border border-transparent  py-2 px-4 shadow-sm"
            onClick={handleSignUp}
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
