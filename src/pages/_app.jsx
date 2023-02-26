import "animate.css";
import "aos/dist/aos.css";
import "@fontsource/inter";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
// Globals
import React from "react";
import AOS from "aos";
import App from "next/app";
import Head from "next/head";
import http from "@/utils/http";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
// Redux
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "@/stores";
import { PersistGate } from "redux-persist/integration/react";

//!Proggress bar page transition with NProgress
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", (url) => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default class MyApp extends App {
  componentDidMount() {
    console.log(`APP VERSION : v${process.env.NEXT_PUBLIC_APP_VERSION}`);

    AOS.init({
      delay: 10,
      duration: 1500,
      once: true,
    });
  }

  render() {
    return (
      <>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppMain {...this.props} />
          </PersistGate>
        </Provider>
      </>
    );
  }
}

function AppMain(props) {
  const { Component, pageProps } = props;
  const {
    token: { login, otp },
  } = useSelector((state) => state.auth);

  const token = login || otp;

  React.useEffect(() => {
    if (token) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    http.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => Promise.reject(error)
    );
  }, [token]);

  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
