//import { useEffect } from "react";
import Layout from "../layouts/layout";
import "../styles/globals.css";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import Router from 'next/router';
import { Component } from "react";

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;