import React from "react";
import Footer from "./footer";
import Navbar from "../components/Navbar/Navbar";

export default function ({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
    <Navbar />
      {children}
    </>
  );
}