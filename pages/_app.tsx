//import { useEffect } from "react";
import {useRouter} from 'next/router';
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

  const router = useRouter();

  if(router.asPath =='/')  {
     return (
       <Component {...pageProps} />
     )
  }
  else if (router.asPath == '/login' ){
    return (
      <Component {...pageProps} />
    )
  }
  else if (router.asPath == '/register'){
    return (
      <Component {...pageProps} />
    )
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;