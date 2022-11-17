import React from "react";
import Footer from "./footer";

export default function ({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}