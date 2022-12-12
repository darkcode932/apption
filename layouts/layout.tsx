/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import Footer from "./footer";
import Navbar from "../components/Navbar/Navbar";

// eslint-disable-next-line react/display-name
export default function ({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
    <Navbar />
      {children}
    <Footer />
    </>
  );
}